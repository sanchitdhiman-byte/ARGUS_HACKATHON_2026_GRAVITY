"""
Module 1 - Grant Programmes
Provides programme catalogue and eligibility pre-check.
"""
from fastapi import APIRouter
from datetime import date
from dateutil.relativedelta import relativedelta
from dateutil.parser import parse as parse_date
import schemas

router = APIRouter(tags=["programmes"])

# ─── Static Programme Data ────────────────────────────────────────────────────

PROGRAMMES = {
    "CDG": {
        "name": "Community Development Grant",
        "code": "CDG",
        "purpose": "Fund community-level infrastructure and social service projects",
        "funding_min": 200000,
        "funding_max": 2000000,
        "duration_min_months": 6,
        "duration_max_months": 18,
        "eligible_org_types": ["NGO", "Trust", "Section 8 Company"],
        "application_window": "April 1 – June 30",
        "max_awards": 10,
        "total_budget": 20000000,
        "eligibility_rules": [
            {"id": "E1", "description": "Organisation must be an NGO, Trust, or Section 8 Company"},
            {"id": "E2", "description": "Organisation must be registered for at least 2 years"},
            {"id": "E3", "description": "Project must have a defined geographic focus"},
            {"id": "E4", "description": "Grant amount must be between ₹2 lakh and ₹20 lakh"},
            {"id": "E5", "description": "Project duration must be 6–18 months"},
            {"id": "E6", "description": "Overhead costs must not exceed 15% of total budget"},
            {"id": "E7", "description": "Sum of budget line items must reconcile with total requested (within ₹500)"},
        ],
        "scoring_rubric": [
            {"dimension": "Community Need & Problem Clarity", "weight": 0.25, "description": "How clearly is the community problem articulated? Is data/evidence provided?"},
            {"dimension": "Solution Design & Feasibility", "weight": 0.25, "description": "Is the proposed solution logical, practical, and achievable within the timeline?"},
            {"dimension": "Team & Organisational Capacity", "weight": 0.20, "description": "Does the organisation have the expertise and track record to deliver?"},
            {"dimension": "Budget Reasonableness", "weight": 0.15, "description": "Are costs justified and proportional to expected outputs?"},
            {"dimension": "Sustainability & Long-term Impact", "weight": 0.15, "description": "What happens after grant funding ends? Is there a sustainability plan?"},
        ],
        "required_documents": [
            "Registration Certificate",
            "Audited Financial Statements (last 2 years)",
            "80G/12A Certificate",
            "FCRA Certificate (if applicable)",
            "Board Resolution authorising application",
            "Annual Report",
        ],
    },
    "EIG": {
        "name": "Education Innovation Grant",
        "code": "EIG",
        "purpose": "Support technology-driven educational innovation to improve learning outcomes",
        "funding_min": 500000,
        "funding_max": 5000000,
        "duration_min_months": 12,
        "duration_max_months": 24,
        "eligible_org_types": ["NGO", "EdTech Non-profit", "Research Institution", "University"],
        "application_window": "Rolling - reviewed quarterly (Jan, Apr, Jul, Oct)",
        "max_awards_per_quarter": 5,
        "total_budget": 50000000,
        "eligibility_rules": [
            {"id": "E1", "description": "Organisation must be an NGO, EdTech Non-profit, Research Institution, or University"},
            {"id": "E2", "description": "Organisation must be registered for at least 2 years"},
            {"id": "E3", "description": "Project must target schools or educational institutions"},
            {"id": "E4", "description": "Grant amount must be between ₹5 lakh and ₹50 lakh"},
            {"id": "E5", "description": "Project duration must be 12–24 months"},
            {"id": "E6", "description": "Must demonstrate a clear technology or innovation component"},
            {"id": "E7", "description": "Must include a measurable learning outcome metric"},
        ],
        "scoring_rubric": [
            {"dimension": "Innovation & Differentiation", "weight": 0.25, "description": "How novel and differentiated is the intervention?"},
            {"dimension": "Evidence Base & Learning Design", "weight": 0.20, "description": "Is the approach grounded in evidence? Is learning design sound?"},
            {"dimension": "Scale & Replication Potential", "weight": 0.20, "description": "Can this be scaled or replicated in other contexts?"},
            {"dimension": "Team & Execution Capacity", "weight": 0.20, "description": "Does the team have technical and educational expertise?"},
            {"dimension": "Budget & Cost Effectiveness", "weight": 0.15, "description": "Is the cost per learner/school reasonable?"},
        ],
        "required_documents": [
            "Registration Certificate",
            "Audited Financial Statements (last 2 years)",
            "Technology / Prototype Description",
            "Pilot Study Results (if any)",
            "Letters of Support from Partner Schools",
            "Team CVs",
        ],
    },
    "ECAG": {
        "name": "Environment & Climate Action Grant",
        "code": "ECAG",
        "purpose": "Fund environmental conservation and climate resilience projects at the community level",
        "funding_min": 300000,
        "funding_max": 3000000,
        "duration_min_months": 6,
        "duration_max_months": 24,
        "eligible_org_types": ["NGO", "FPO", "Panchayat", "Research Institution"],
        "application_window": "Jan 1–Feb 28 and Jul 1–Aug 31",
        "max_awards": 15,
        "total_budget": 45000000,
        "eligibility_rules": [
            {"id": "E1", "description": "Organisation must be an NGO, FPO, Panchayat, or Research Institution"},
            {"id": "E2", "description": "Organisation must be registered for at least 2 years"},
            {"id": "E3", "description": "Project must address a specific environmental or climate problem"},
            {"id": "E4", "description": "Grant amount must be between ₹3 lakh and ₹30 lakh"},
            {"id": "E5", "description": "Project duration must be 6–24 months"},
            {"id": "E6", "description": "Must include community involvement in project design or delivery"},
            {"id": "E7", "description": "Must define measurable environmental indicators"},
        ],
        "scoring_rubric": [
            {"dimension": "Environmental Impact & Urgency", "weight": 0.25, "description": "How significant is the environmental problem and the proposed impact?"},
            {"dimension": "Community Involvement", "weight": 0.25, "description": "How meaningfully are local communities engaged in the intervention?"},
            {"dimension": "Technical Feasibility", "weight": 0.20, "description": "Is the intervention technically sound and achievable?"},
            {"dimension": "Monitoring & Indicators", "weight": 0.15, "description": "Are environmental indicators clearly defined and measurable?"},
            {"dimension": "Budget Reasonableness", "weight": 0.15, "description": "Are costs justified relative to expected environmental outcomes?"},
        ],
        "required_documents": [
            "Registration Certificate",
            "Audited Financial Statements (last 2 years)",
            "Environmental Assessment / Site Description",
            "Community Consent / Panchayat Resolution",
            "Technical Plan",
            "Letters from Government Partners (if applicable)",
        ],
    },
}


# ─── Routes ──────────────────────────────────────────────────────────────────

@router.get("/programmes")
def list_programmes():
    """List all available grant programmes."""
    return [
        {
            "code": v["code"],
            "name": v["name"],
            "purpose": v["purpose"],
            "funding_min": v["funding_min"],
            "funding_max": v["funding_max"],
            "duration_min_months": v["duration_min_months"],
            "duration_max_months": v["duration_max_months"],
            "eligible_org_types": v["eligible_org_types"],
            "application_window": v["application_window"],
        }
        for v in PROGRAMMES.values()
    ]


@router.get("/programmes/{grant_type}")
def get_programme(grant_type: str):
    """Get detailed information for a specific grant programme."""
    p = PROGRAMMES.get(grant_type.upper())
    if not p:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Programme '{grant_type}' not found")
    return p


@router.post("/eligibility-check", response_model=schemas.EligibilityCheckResponse)
def check_eligibility(req: schemas.EligibilityCheckRequest):
    """
    Pre-check eligibility for a grant programme (no login required).
    Runs hard rules only - no AI.
    """
    grant_type = req.grant_type.upper()
    p = PROGRAMMES.get(grant_type)
    if not p:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=f"Unknown grant type: {grant_type}")

    reasons = []
    eligible = True

    # E1 - Organisation type
    allowed_types = p["eligible_org_types"]
    # Normalise comparison
    org_type_lower = req.org_type.strip().lower()
    allowed_lower = [t.lower() for t in allowed_types]
    if org_type_lower not in allowed_lower:
        eligible = False
        reasons.append(f"E1: Organisation type '{req.org_type}' is not eligible. Allowed types: {', '.join(allowed_types)}")

    # E2 - Established at least 2 years ago
    if req.established_year:
        current_year = date.today().year
        years_active = current_year - req.established_year
        if years_active < 2:
            eligible = False
            reasons.append(f"E2: Organisation must be established for at least 2 years (established {req.established_year}, {years_active} year(s) ago)")

    # E3 - Geographic focus (check project_start provided as proxy for location provided)
    if not req.district or not req.state:
        eligible = False
        reasons.append("E3: Project must have a defined geographic focus (district and state required)")

    # E4 - Amount range
    amount_min = p["funding_min"]
    amount_max = p["funding_max"]
    if not (amount_min <= req.amount_requested <= amount_max):
        eligible = False
        reasons.append(
            f"E4: Requested amount ₹{req.amount_requested:,.0f} is outside the allowed range "
            f"₹{amount_min:,.0f} – ₹{amount_max:,.0f}"
        )

    # E5 - Duration check
    try:
        start = parse_date(req.project_start)
        end = parse_date(req.project_end)
        delta = relativedelta(end, start)
        duration_months = delta.years * 12 + delta.months
        if duration_months < p["duration_min_months"] or duration_months > p["duration_max_months"]:
            eligible = False
            reasons.append(
                f"E5: Project duration {duration_months} months is outside the allowed range "
                f"{p['duration_min_months']}–{p['duration_max_months']} months"
            )
    except Exception:
        reasons.append("E5: Could not parse project start/end dates — please use YYYY-MM-DD format")

    # E6 - Overhead ratio (if provided)
    if req.budget_overheads is not None and req.amount_requested > 0:
        overhead_ratio = req.budget_overheads / req.amount_requested
        if overhead_ratio > 0.15:
            eligible = False
            reasons.append(
                f"E6: Overhead ratio {overhead_ratio*100:.1f}% exceeds the maximum allowed 15%"
            )

    if eligible and not reasons:
        reasons.append("All hard eligibility rules passed.")

    return schemas.EligibilityCheckResponse(
        eligible=eligible,
        reasons=reasons,
        programme=p["name"]
    )
