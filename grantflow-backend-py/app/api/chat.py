"""AI-guided conversational intake assistant for grant applications."""

import json
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import get_current_user
from app.core.constants import GRANT_PROGRAMMES
from app.core.grant_metadata import GRANT_METADATA, get_required_fields, get_budget_rules
from app.models.models import User
from app.services.ai_agent import _call_gemini, _parse_json_response

router = APIRouter(tags=["Chat"])


def _get_form_fields(grant_type: str) -> dict[str, list[str]]:
    """Build section→fields map dynamically from grant metadata."""
    meta = GRANT_METADATA.get(grant_type)
    if not meta:
        # Fallback to generic fields
        return {
            "organisation": [
                "orgName", "regNumber", "entityType", "establishedYear",
                "budget", "contactName", "contactRole", "email", "phone",
                "address", "city", "stateRegion", "postalCode",
            ],
            "project": [
                "projectTitle", "projectLocation", "problemStatement",
                "proposedSolution", "targetBeneficiaries",
            ],
            "budget": [
                "personnel", "equipment", "travel", "overheads", "other",
                "totalRequested", "justification",
            ],
            "experience": [
                "hasPreviousGrants", "priorProjects", "priorFunder", "priorAmount",
                "signatoryName", "designation",
            ],
        }
    sections = {}
    for section in meta["sections"]:
        sections[section["id"]] = [f["key"] for f in section["fields"]]
    return sections


def _get_rubric_hints(grant_type: str) -> list[str]:
    """Extract rubric hints for use in AI prompts."""
    meta = GRANT_METADATA.get(grant_type)
    if not meta:
        return []
    hints = []
    for section in meta["sections"]:
        for field in section["fields"]:
            if field.get("rubric_hint"):
                hints.append(f"- {field['label']}: {field['rubric_hint']}")
    return hints


class ChatRequest(BaseModel):
    grant_type: str
    message: str
    collected_data: dict = {}
    conversation_history: list = []


class ChatResponse(BaseModel):
    reply: str
    collected_data: dict
    field_updates: dict = {}
    current_section: str = ""
    progress_pct: int = 0
    complete: bool = False


@router.post("/chat", response_model=ChatResponse)
def chat_intake(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    programme = GRANT_PROGRAMMES.get(req.grant_type)
    if not programme:
        return ChatResponse(
            reply=f"I don't recognise the grant type '{req.grant_type}'. Please choose CDG, EIG, or ECAG.",
            collected_data=req.collected_data,
        )

    collected = req.collected_data or {}
    form_fields = _get_form_fields(req.grant_type)

    # Determine which fields are still missing
    all_fields = []
    for section_fields in form_fields.values():
        all_fields.extend(section_fields)

    filled = [f for f in all_fields if collected.get(f)]
    missing = [f for f in all_fields if not collected.get(f)]
    progress = int(len(filled) / max(len(all_fields), 1) * 100)

    # Determine current section
    current_section = "organisation"
    for section, fields in form_fields.items():
        if any(f in missing for f in fields):
            current_section = section
            break

    # Get rubric hints and budget rules for context
    rubric_hints = _get_rubric_hints(req.grant_type)
    budget_rules = get_budget_rules(req.grant_type)

    # Build field label map from metadata
    meta = GRANT_METADATA.get(req.grant_type)
    field_labels = {}
    if meta:
        for section in meta["sections"]:
            for field in section["fields"]:
                field_labels[field["key"]] = field["label"]

    # Build the AI prompt
    history_text = ""
    for msg in (req.conversation_history or [])[-6:]:
        role = msg.get("role", "user")
        history_text += f"{role}: {msg.get('content', '')}\n"

    rubric_section = ""
    if rubric_hints:
        rubric_section = f"\nScoring rubric fields (guide the applicant to provide strong answers for these):\n" + "\n".join(rubric_hints)

    budget_section = ""
    if budget_rules:
        budget_section = f"\nBudget rules:\n- Overhead cap: {budget_rules.get('overhead_cap_pct', 15)}%\n- Funding range: INR {budget_rules.get('funding_min', 0):,} to INR {budget_rules.get('funding_max', 0):,}"

    prompt = f"""You are a friendly grant application assistant helping an applicant fill out a {programme['name']} ({req.grant_type}) application.

Your job is to ask questions ONE AT A TIME to collect the required information. Do NOT write or suggest content — only ask and record what the applicant provides.

Programme details:
- Funding: INR {programme['funding_min']:,} to {programme['funding_max']:,}
- Duration: {programme['duration_min_months']}–{programme['duration_max_months']} months
- Eligible: {', '.join(programme['eligible_org_types'])}
{rubric_section}
{budget_section}

Data collected so far:
{json.dumps(collected, indent=2)}

Fields still needed: {', '.join(missing[:5])}
Current section: {current_section}

Recent conversation:
{history_text}

User's latest message: {req.message}

Instructions:
1. Extract any field values from the user's message and return them in field_updates
2. Ask the NEXT missing question naturally
3. If all fields are filled, congratulate them and set complete=true
4. Keep responses concise (2-3 sentences max)
5. For rubric-scored fields, gently guide the applicant to provide detailed, evidence-based answers
6. If entering budget fields, remind about the overhead cap ({budget_rules.get('overhead_cap_pct', 15)}%) and funding range

Return ONLY a JSON object:
{{
  "reply": "<your response to the user>",
  "field_updates": {{"<field_name>": "<extracted_value>", ...}},
  "complete": false
}}"""

    result = _call_gemini(prompt)
    parsed = _parse_json_response(result)

    if parsed and "reply" in parsed:
        field_updates = parsed.get("field_updates", {})
        # Merge updates into collected data
        for k, v in field_updates.items():
            if v and k in all_fields:
                collected[k] = v

        # Recalculate progress after updates
        filled_now = [f for f in all_fields if collected.get(f)]
        progress = int(len(filled_now) / max(len(all_fields), 1) * 100)

        return ChatResponse(
            reply=parsed["reply"],
            collected_data=collected,
            field_updates=field_updates,
            current_section=current_section,
            progress_pct=progress,
            complete=parsed.get("complete", False),
        )

    # Fallback: ask for the next missing field using metadata labels
    field_updates = {}
    if missing and req.message.strip():
        next_field = missing[0]
        field_updates[next_field] = req.message.strip()
        collected[next_field] = req.message.strip()
        missing = missing[1:]

    if missing:
        next_label = field_labels.get(missing[0], missing[0])
        reply = f"Got it! Now, could you please tell me {next_label.lower()}?"
    else:
        reply = "All information has been collected! You can now review and submit your application."

    filled_now = [f for f in all_fields if collected.get(f)]
    progress = int(len(filled_now) / max(len(all_fields), 1) * 100)

    return ChatResponse(
        reply=reply,
        collected_data=collected,
        field_updates=field_updates,
        current_section=current_section,
        progress_pct=progress,
        complete=len(missing) == 0,
    )
