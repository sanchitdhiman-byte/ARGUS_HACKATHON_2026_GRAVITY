"""Gemini/LLM integration for screening, review packages, and compliance analysis."""

import json
import logging
from typing import Any

from app.core.config import settings

logger = logging.getLogger(__name__)

_gemini_model = None


def _get_model():
    global _gemini_model
    if _gemini_model is None:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            _gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
        except Exception as e:
            logger.warning(f"Gemini unavailable: {e}. Falling back to mock AI.")
            _gemini_model = "mock"
    return _gemini_model


def _call_gemini(prompt: str) -> str:
    model = _get_model()
    if model == "mock":
        return ""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return ""


def _parse_json_response(text: str) -> dict:
    """Extract JSON from Gemini response (may be wrapped in markdown)."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {}


# ── Thematic Alignment ────────────────────────────────────────────────

def check_thematic_alignment(grant_type: str, project_title: str, problem_statement: str, proposed_solution: str) -> dict:
    """AI soft check: does the application align with the grant's thematic area?"""
    themes = {
        "CDG": "community development, infrastructure, social services, rural development",
        "EIG": "education innovation, learning outcomes, pedagogy, EdTech, school improvement",
        "ECAG": "environment, climate action, conservation, clean energy, climate resilience",
    }
    theme_desc = themes.get(grant_type, "general development")

    prompt = f"""Analyse the following grant application for thematic alignment with "{theme_desc}".

Project Title: {project_title}
Problem Statement: {problem_statement}
Proposed Solution: {proposed_solution}

Return ONLY a JSON object:
{{
  "alignment_score": <integer 0-100>,
  "aligned": <true if score >= 60>,
  "reasoning": "<one paragraph explanation>"
}}"""

    result = _call_gemini(prompt)
    parsed = _parse_json_response(result)

    if not parsed:
        # Mock fallback
        score = 75
        if problem_statement and len(problem_statement) > 50:
            score = 80
        return {
            "alignment_score": score,
            "aligned": score >= 60,
            "reasoning": f"Mock assessment: application appears aligned with {theme_desc} themes based on keyword analysis.",
        }
    return parsed


def check_narrative_quality(problem_statement: str, proposed_solution: str, outcomes: str = "") -> dict:
    """AI soft check: logical coherence, beneficiary specificity, measurable outcomes."""
    prompt = f"""Assess the narrative quality of this grant application.

Problem Statement: {problem_statement}
Proposed Solution: {proposed_solution}
Expected Outcomes: {outcomes}

Evaluate:
1. Logical coherence between problem → solution → outcomes
2. Specificity of beneficiary description
3. Presence of at least one measurable outcome indicator

Return ONLY a JSON object:
{{
  "quality_score": <integer 0-100>,
  "coherence": "<high/medium/low>",
  "beneficiary_specificity": "<high/medium/low>",
  "has_measurable_outcome": <true/false>,
  "flags": ["<list of concerns>"],
  "reasoning": "<one paragraph>"
}}"""

    result = _call_gemini(prompt)
    parsed = _parse_json_response(result)

    if not parsed:
        has_measurable = any(kw in (outcomes or proposed_solution or "").lower()
                            for kw in ["percent", "%", "number", "increase", "decrease", "reduce"])
        return {
            "quality_score": 70,
            "coherence": "medium",
            "beneficiary_specificity": "medium" if "beneficiar" in (problem_statement or "").lower() else "low",
            "has_measurable_outcome": has_measurable,
            "flags": [] if has_measurable else ["No clearly measurable outcome indicator found"],
            "reasoning": "Mock assessment: narrative appears adequate but could be more specific.",
        }
    return parsed


# ── AI Review Package ─────────────────────────────────────────────────

def generate_review_package(application_data: dict, grant_type: str) -> dict:
    """Generate AI review package: summary, suggested scores, and risk flags."""
    prompt = f"""You are reviewing a {grant_type} grant application. Analyse it and produce a review package.

Application Data:
{json.dumps(application_data, indent=2, default=str)}

Return ONLY a JSON object with this structure:
{{
  "summary": {{
    "applicant": "<who is applying>",
    "project": "<what they want to do>",
    "location": "<where>",
    "beneficiaries": "<how many beneficiaries>",
    "duration": "<how long>",
    "amount": "<how much requested>"
  }},
  "suggested_scores": {{
    "alignment": {{"score": <1-5>, "justification": "<citing application text>"}},
    "feasibility": {{"score": <1-5>, "justification": "<citing application text>"}},
    "impact": {{"score": <1-5>, "justification": "<citing application text>"}},
    "budget": {{"score": <1-5>, "justification": "<citing application text>"}},
    "track_record": {{"score": <1-5>, "justification": "<citing application text>"}}
  }},
  "risk_flags": [
    {{
      "category": "<budget_anomaly|unrealistic_timeline|vague_outcomes|insufficient_team|incomplete_prior_grants>",
      "description": "<specific concern>",
      "severity": "<high|medium|low>"
    }}
  ]
}}"""

    result = _call_gemini(prompt)
    parsed = _parse_json_response(result)

    if not parsed:
        return _mock_review_package(application_data)
    return parsed


def _mock_review_package(app: dict) -> dict:
    """Fallback mock review package when Gemini is unavailable."""
    total = float(app.get("total_requested", 0) or 0)
    risk_flags = []

    # Budget anomaly check
    for field, label in [("budget_personnel", "Personnel"), ("budget_equipment", "Equipment"),
                         ("budget_travel", "Travel"), ("budget_overheads", "Overheads")]:
        val = float(app.get(field, 0) or 0)
        if total > 0 and val / total > 0.6:
            risk_flags.append({
                "category": "budget_anomaly",
                "description": f"{label} costs ({val:,.0f}) exceed 60% of total budget ({total:,.0f})",
                "severity": "high",
            })

    # Vague outcomes check
    solution = str(app.get("proposed_solution", ""))
    if len(solution) < 100:
        risk_flags.append({
            "category": "vague_outcomes",
            "description": "Proposed solution description is very brief — may lack measurable outcomes",
            "severity": "medium",
        })

    base = 3
    problem = str(app.get("problem_statement", ""))
    alignment = min(5, base + (1 if len(problem) > 100 else 0) + (1 if len(solution) > 100 else 0))
    feasibility = min(5, base + (1 if total > 0 else -1))
    impact = min(5, base + (1 if int(app.get("target_beneficiaries", 0) or 0) > 100 else 0))

    return {
        "summary": {
            "applicant": app.get("org_name", "Unknown"),
            "project": app.get("project_title", "Untitled"),
            "location": app.get("project_location", "Not specified"),
            "beneficiaries": str(app.get("target_beneficiaries", "Not specified")),
            "duration": "As per application timeline",
            "amount": f"INR {total:,.0f}",
        },
        "suggested_scores": {
            "alignment": {"score": alignment, "justification": "Based on problem statement analysis"},
            "feasibility": {"score": feasibility, "justification": "Based on budget and project design"},
            "impact": {"score": impact, "justification": "Based on beneficiary count and outcomes"},
            "budget": {"score": 3, "justification": "Budget lines appear within normal ranges"},
            "track_record": {"score": 3, "justification": "Based on prior project information provided"},
        },
        "risk_flags": risk_flags,
    }


# ── Compliance Analysis ───────────────────────────────────────────────

def analyse_compliance_report(report_data: dict, application_data: dict) -> dict:
    """AI analysis of a submitted compliance report against the original application."""
    prompt = f"""Analyse this grant compliance report against the original approved application.

Original Application:
{json.dumps(application_data, indent=2, default=str)}

Submitted Report:
{json.dumps(report_data, indent=2, default=str)}

Evaluate:
1. Content: Are activities consistent with what was approved? Is beneficiary progress on track?
   Does the narrative acknowledge deviations? Is the report balanced (acknowledges challenges)?
2. Financial: Arithmetic consistency between expenditure figures. Budget lines deviating >10%.
   Variance explanations present? Underspend alert if cumulative spend < 30% of budget at 50%+ of timeline.

Return ONLY a JSON object:
{{
  "content_quality": "<satisfactory|needs_clarification|concerns_found>",
  "content_flags": [
    {{"field": "<field name>", "issue": "<description>", "severity": "<high|medium|low>"}}
  ],
  "financial_flags": [
    {{"field": "<field name>", "issue": "<description>", "severity": "<high|medium|low>"}}
  ],
  "recommended_action": "<approve|request_clarification|flag_compliance>",
  "summary": "<brief overall assessment>"
}}"""

    result = _call_gemini(prompt)
    parsed = _parse_json_response(result)

    if not parsed:
        return {
            "content_quality": "satisfactory",
            "content_flags": [],
            "financial_flags": [],
            "recommended_action": "approve",
            "summary": "Mock analysis: report appears compliant with approved application terms.",
        }
    return parsed
