"""
AI Service for GrantFlow - uses Anthropic Claude for intelligent grant processing.
Falls back to mock data if API key not available or call fails.
"""
import os
import json
import logging

logger = logging.getLogger(__name__)

# Try to import Anthropic SDK
try:
    from anthropic import Anthropic
    _anthropic_available = True
except ImportError:
    _anthropic_available = False
    logger.warning("Anthropic SDK not installed. Using mock AI responses.")

_client = None

def _get_client():
    global _client
    if not _anthropic_available:
        return None
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return None
    if _client is None:
        _client = Anthropic(api_key=api_key)
    return _client


def _call_claude(prompt: str, max_tokens: int = 2000) -> str:
    """Call Claude API and return text response. Returns None if unavailable."""
    client = _get_client()
    if client is None:
        return None
    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text
    except Exception as e:
        logger.error(f"Claude API call failed: {e}")
        return None


def _parse_json_response(text: str) -> dict:
    """Extract JSON from Claude response text."""
    if not text:
        return {}
    # Try direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Try to extract JSON block
    import re
    match = re.search(r'```(?:json)?\s*(\{[\s\S]*?\})\s*```', text)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
    # Try to find first { ... } block
    match = re.search(r'\{[\s\S]*\}', text)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass
    return {}


# ─── Mock responses ──────────────────────────────────────────────────────────

def _mock_screen_application(application_data: dict, grant_type: str) -> dict:
    org_name = application_data.get("org_name", "Organisation")
    problem = str(application_data.get("problem_statement", ""))
    solution = str(application_data.get("proposed_solution", ""))
    amount = application_data.get("total_requested", 0)

    thematic_score = 72
    flags = []

    if len(problem) < 50:
        flags.append("Problem statement is too brief")
        thematic_score -= 10
    if len(solution) < 50:
        flags.append("Proposed solution lacks detail")
        thematic_score -= 10
    if amount == 0:
        flags.append("No budget amount provided")
        thematic_score -= 15

    grant_map = {
        "CDG": "community development",
        "EIG": "education innovation and technology",
        "ECAG": "environmental conservation and climate action"
    }
    theme = grant_map.get(grant_type, "general development")

    return {
        "thematic_score": max(0, min(100, thematic_score)),
        "narrative_quality": "moderate" if len(problem) > 100 and len(solution) > 100 else "weak",
        "flags": flags,
        "summary": (
            f"{org_name} proposes a {theme} initiative addressing: "
            f"{problem[:100]}... The proposed solution involves: {solution[:100]}... "
            f"Total budget requested: ₹{amount:,.0f}."
        )
    }


def _mock_generate_review_package(application_data: dict, grant_type: str) -> dict:
    org = application_data.get("org_name", "Org")
    title = application_data.get("project_title", "Project")
    location = application_data.get("project_location", "India")
    beneficiaries = application_data.get("target_beneficiaries", 0)
    amount = application_data.get("total_requested", 0)

    dimensions_map = {
        "CDG": [
            {"name": "Community Need & Problem Clarity", "weight": 0.25},
            {"name": "Solution Design & Feasibility", "weight": 0.25},
            {"name": "Team & Organisational Capacity", "weight": 0.20},
            {"name": "Budget Reasonableness", "weight": 0.15},
            {"name": "Sustainability & Long-term Impact", "weight": 0.15},
        ],
        "EIG": [
            {"name": "Innovation & Differentiation", "weight": 0.25},
            {"name": "Evidence Base & Learning Design", "weight": 0.20},
            {"name": "Scale & Replication Potential", "weight": 0.20},
            {"name": "Team & Execution Capacity", "weight": 0.20},
            {"name": "Budget & Cost Effectiveness", "weight": 0.15},
        ],
        "ECAG": [
            {"name": "Environmental Impact & Urgency", "weight": 0.25},
            {"name": "Community Involvement", "weight": 0.25},
            {"name": "Technical Feasibility", "weight": 0.20},
            {"name": "Monitoring & Indicators", "weight": 0.15},
            {"name": "Budget Reasonableness", "weight": 0.15},
        ],
    }

    dims = dimensions_map.get(grant_type, dimensions_map["CDG"])
    dimension_scores = []
    for d in dims:
        dimension_scores.append({
            "name": d["name"],
            "weight": d["weight"],
            "score": 3,
            "justification": f"Based on the application narrative, this dimension shows moderate quality. The applicant has provided basic information but could strengthen specifics.",
            "section_ref": "Problem Statement / Proposed Solution"
        })

    risk_flags = []
    overhead = application_data.get("budget_overheads", 0) or 0
    if overhead > amount * 0.15:
        risk_flags.append({
            "category": "Budget",
            "description": f"Overhead ratio ({overhead/amount*100:.1f}%) exceeds recommended 15%",
            "severity": "medium"
        })
    if beneficiaries == 0:
        risk_flags.append({
            "category": "Impact",
            "description": "No target beneficiary count specified",
            "severity": "low"
        })

    return {
        "summary": (
            f"{org} proposes '{title}' to be implemented in {location}. "
            f"The project targets {beneficiaries} beneficiaries over the grant period "
            f"with a total budget of ₹{amount:,.0f}. "
            f"This is a {grant_type} application focusing on community-level outcomes."
        ),
        "dimension_scores": dimension_scores,
        "risk_flags": risk_flags
    }


def _mock_analyze_compliance_report(report_data: dict, application_data: dict) -> dict:
    expenditure = report_data.get("expenditure_period", 0) or 0
    approved_amount = application_data.get("total_requested", 1) or 1
    ratio = expenditure / approved_amount if approved_amount else 0

    financial_flags = []
    content_flags = []

    if ratio > 0.6:
        financial_flags.append("More than 60% of grant disbursed in a single period — verify milestone completion")
    if not report_data.get("beneficiaries_reached"):
        content_flags.append("Beneficiary count not reported")
    if not report_data.get("activities_completed"):
        content_flags.append("Completed activities not described")

    overall = "satisfactory"
    if financial_flags or content_flags:
        overall = "needs_clarification"
    if len(financial_flags) > 1 or len(content_flags) > 2:
        overall = "concerns_found"

    return {
        "content_rating": overall,
        "financial_flags": financial_flags,
        "content_flags": content_flags,
        "recommended_action": "approved" if overall == "satisfactory" else "clarification_requested"
    }


# ─── Public API ──────────────────────────────────────────────────────────────

def screen_application(application_data: dict, grant_type: str) -> dict:
    """
    Run AI soft checks on application.
    Returns: {thematic_score, narrative_quality, flags, summary}
    """
    grant_descriptions = {
        "CDG": "Community Development Grant - funds community-level infrastructure and social service projects by NGOs, Trusts, and Section 8 Companies.",
        "EIG": "Education Innovation Grant - supports technology-driven educational innovation by NGOs, EdTech non-profits, Research Institutions, and Universities.",
        "ECAG": "Environment & Climate Action Grant - funds environmental conservation and climate resilience projects by NGOs, FPOs, Panchayats, and Research Institutions.",
    }
    grant_desc = grant_descriptions.get(grant_type, grant_type)

    prompt = f"""You are an expert grant evaluator. Analyse this grant application for the {grant_type} programme.

Programme: {grant_desc}

Application Data:
{json.dumps(application_data, indent=2, default=str)}

Please evaluate:
1. Thematic alignment score (0-100): How well does this application align with the {grant_type} programme goals?
2. Narrative quality: Is the writing coherent, specific, and does it describe measurable outcomes?
3. Soft flags: What concerns or weaknesses are present?
4. A brief summary of what this application is about.

Respond ONLY with valid JSON in this exact format:
{{
  "thematic_score": <integer 0-100>,
  "narrative_quality": "<strong|moderate|weak>",
  "flags": ["<flag1>", "<flag2>"],
  "summary": "<2-3 sentence summary of the application>"
}}"""

    response_text = _call_claude(prompt)
    if response_text:
        parsed = _parse_json_response(response_text)
        if parsed and "thematic_score" in parsed:
            return parsed

    # Fall back to mock
    return _mock_screen_application(application_data, grant_type)


def generate_review_package(application_data: dict, grant_type: str) -> dict:
    """
    Generate AI review package with summary, suggested scores, and risk flags.
    Returns: {summary, dimension_scores, risk_flags}
    """
    rubric_map = {
        "CDG": [
            {"name": "Community Need & Problem Clarity", "weight": 0.25},
            {"name": "Solution Design & Feasibility", "weight": 0.25},
            {"name": "Team & Organisational Capacity", "weight": 0.20},
            {"name": "Budget Reasonableness", "weight": 0.15},
            {"name": "Sustainability & Long-term Impact", "weight": 0.15},
        ],
        "EIG": [
            {"name": "Innovation & Differentiation", "weight": 0.25},
            {"name": "Evidence Base & Learning Design", "weight": 0.20},
            {"name": "Scale & Replication Potential", "weight": 0.20},
            {"name": "Team & Execution Capacity", "weight": 0.20},
            {"name": "Budget & Cost Effectiveness", "weight": 0.15},
        ],
        "ECAG": [
            {"name": "Environmental Impact & Urgency", "weight": 0.25},
            {"name": "Community Involvement", "weight": 0.25},
            {"name": "Technical Feasibility", "weight": 0.20},
            {"name": "Monitoring & Indicators", "weight": 0.15},
            {"name": "Budget Reasonableness", "weight": 0.15},
        ],
    }
    rubric = rubric_map.get(grant_type, rubric_map["CDG"])
    rubric_text = "\n".join([f"- {d['name']} (weight: {d['weight']})" for d in rubric])

    prompt = f"""You are an expert grant reviewer for the {grant_type} programme. Generate a structured review package for this application.

Application Data:
{json.dumps(application_data, indent=2, default=str)}

Scoring Rubric (score each 1-5, where 1=Poor, 2=Below Average, 3=Average, 4=Good, 5=Excellent):
{rubric_text}

Please provide:
1. A factual summary (who, what, where, beneficiaries, duration, amount requested)
2. Suggested scores for each rubric dimension with justification and the section of the application you're referencing
3. Risk flags: budget anomalies, unrealistic timeline, vague outcomes, small team, no prior experience

Respond ONLY with valid JSON in this exact format:
{{
  "summary": "<factual 3-4 sentence summary>",
  "dimension_scores": [
    {{
      "name": "<dimension name>",
      "weight": <weight as decimal>,
      "score": <1-5>,
      "justification": "<2-3 sentences>",
      "section_ref": "<which section of the application you reviewed>"
    }}
  ],
  "risk_flags": [
    {{
      "category": "<Budget|Timeline|Outcomes|Team|Track Record>",
      "description": "<specific concern>",
      "severity": "<low|medium|high>"
    }}
  ]
}}"""

    response_text = _call_claude(prompt, max_tokens=3000)
    if response_text:
        parsed = _parse_json_response(response_text)
        if parsed and "dimension_scores" in parsed:
            return parsed

    return _mock_generate_review_package(application_data, grant_type)


def analyze_compliance_report(report_data: dict, application_data: dict) -> dict:
    """
    Analyse a progress/compliance report against the approved application.
    Returns: {content_rating, financial_flags, content_flags, recommended_action}
    """
    prompt = f"""You are a grant compliance analyst. Analyse this progress report against the approved application.

Approved Application:
{json.dumps(application_data, indent=2, default=str)}

Progress Report Submitted:
{json.dumps(report_data, indent=2, default=str)}

Please check:
1. Activities consistency: Do reported activities match the approved plan?
2. Beneficiary progress: Is beneficiary reach on track relative to targets?
3. Narrative balance: Is the report honest about challenges and not overly positive?
4. Financial arithmetic: Do expenditure figures appear reasonable relative to disbursements?

Respond ONLY with valid JSON in this exact format:
{{
  "content_rating": "<satisfactory|needs_clarification|concerns_found>",
  "financial_flags": ["<flag if any>"],
  "content_flags": ["<flag if any>"],
  "recommended_action": "<approved|clarification_requested|compliance_action>"
}}"""

    response_text = _call_claude(prompt)
    if response_text:
        parsed = _parse_json_response(response_text)
        if parsed and "content_rating" in parsed:
            return parsed

    return _mock_analyze_compliance_report(report_data, application_data)
