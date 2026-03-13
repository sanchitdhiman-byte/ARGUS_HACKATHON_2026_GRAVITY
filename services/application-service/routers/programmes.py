from fastapi import APIRouter
from schemas import EligibilityCheckRequest, EligibilityCheckResponse
from datetime import date
from dateutil.relativedelta import relativedelta
from dateutil.parser import parse as parse_date

router = APIRouter(tags=["programmes"])

GRANT_PROGRAMMES = [
    {"id": "CDG", "name": "Community Development Grant", "description": "For NGOs, Trusts, and Section 8 Companies working on community-level projects.",
     "amount_min": 200000, "amount_max": 2000000, "duration": "6-18 months", "eligible_orgs": ["NGO", "Trust", "Section 8 Company"],
     "focus": "Community infrastructure, social services, livelihood support"},
    {"id": "EIG", "name": "Education Innovation Grant", "description": "For EdTech non-profits and research institutions innovating in education.",
     "amount_min": 500000, "amount_max": 5000000, "duration": "12-24 months", "eligible_orgs": ["NGO", "EdTech Non-profit", "Research Institution", "University"],
     "focus": "Technology-driven education, curriculum innovation, teacher training"},
    {"id": "ECAG", "name": "Environment & Climate Action Grant", "description": "For organisations addressing environmental and climate challenges.",
     "amount_min": 300000, "amount_max": 3000000, "duration": "6-24 months", "eligible_orgs": ["NGO", "FPO", "Panchayat", "Research Institution"],
     "focus": "Afforestation, renewable energy, climate resilience, waste management"},
]


@router.get("/programmes")
def list_programmes():
    return GRANT_PROGRAMMES


@router.get("/programmes/{programme_id}")
def get_programme(programme_id: str):
    prog = next((p for p in GRANT_PROGRAMMES if p["id"] == programme_id), None)
    if not prog:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Programme not found")
    return prog


@router.post("/eligibility-check", response_model=EligibilityCheckResponse)
def check_eligibility(req: EligibilityCheckRequest):
    reasons = []
    eligible = True
    entity = req.org_type.strip().lower()

    cdg_eligible = ["ngo", "trust", "section 8 company", "section8 company"]
    eig_eligible = ["ngo", "edtech non-profit", "edtech nonprofit", "research institution", "university"]
    ecag_eligible = ["ngo", "fpo", "panchayat", "research institution"]

    eligibility_map = {"CDG": cdg_eligible, "EIG": eig_eligible, "ECAG": ecag_eligible}
    allowed = eligibility_map.get(req.grant_type.upper(), [])

    if entity not in allowed:
        eligible = False
        reasons.append(f"Organisation type '{req.org_type}' is not eligible for {req.grant_type}")

    if req.established_year:
        years = date.today().year - req.established_year
        if years < 2:
            eligible = False
            reasons.append(f"Organisation must be at least 2 years old (currently {years} year(s))")

    ranges = {"CDG": (200000, 2000000), "EIG": (500000, 5000000), "ECAG": (300000, 3000000)}
    if req.grant_type.upper() in ranges:
        mn, mx = ranges[req.grant_type.upper()]
        if not (mn <= req.amount_requested <= mx):
            eligible = False
            reasons.append(f"Requested amount {req.amount_requested:,.0f} is outside the range {mn:,.0f}-{mx:,.0f}")

    try:
        start = parse_date(req.project_start)
        end = parse_date(req.project_end)
        delta = relativedelta(end, start)
        months = delta.years * 12 + delta.months
        dur_ranges = {"CDG": (6, 18), "EIG": (12, 24), "ECAG": (6, 24)}
        if req.grant_type.upper() in dur_ranges:
            mn_d, mx_d = dur_ranges[req.grant_type.upper()]
            if not (mn_d <= months <= mx_d):
                eligible = False
                reasons.append(f"Project duration {months} months is outside allowed range {mn_d}-{mx_d} months")
    except Exception:
        reasons.append("Could not parse project dates - please verify")

    if eligible:
        reasons.append(f"Your organisation appears eligible for the {req.grant_type} programme")

    programme_names = {"CDG": "Community Development Grant", "EIG": "Education Innovation Grant", "ECAG": "Environment & Climate Action Grant"}
    return EligibilityCheckResponse(eligible=eligible, reasons=reasons, programme=programme_names.get(req.grant_type.upper(), req.grant_type))
