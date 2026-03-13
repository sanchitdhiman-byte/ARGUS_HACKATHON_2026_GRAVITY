"""Hard and soft rule eligibility screening for grant applications."""

from datetime import datetime
from typing import Any

from app.core.constants import GRANT_PROGRAMMES, CLIMATE_VULNERABLE_DISTRICTS
from app.services.ai_agent import check_thematic_alignment, check_narrative_quality


def run_screening(application: Any) -> dict:
    """Run full eligibility screening and return a structured screening report."""
    grant_type = application.grant_type
    programme = GRANT_PROGRAMMES.get(grant_type)

    if not programme:
        return {
            "eligible": False,
            "hard_checks": [{"rule": "Grant Type", "passed": False, "detail": f"Unknown grant type: {grant_type}"}],
            "soft_checks": [],
            "summary": "Unknown grant type",
        }

    hard_checks = _run_hard_checks(application, programme, grant_type)
    soft_checks = _run_soft_checks(application, grant_type)

    all_hard_passed = all(c["passed"] for c in hard_checks)

    return {
        "eligible": all_hard_passed,
        "hard_checks": hard_checks,
        "soft_checks": soft_checks,
        "summary": "All eligibility criteria met" if all_hard_passed else "One or more eligibility criteria not met",
    }


def _run_hard_checks(app: Any, programme: dict, grant_type: str) -> list[dict]:
    """Evaluate all hard eligibility rules for the grant type."""
    checks = []

    # E1: Organisation Type
    entity = (app.entity_type or "").strip()
    eligible_types = programme.get("eligible_org_types", [])
    type_ok = any(t.lower() in entity.lower() for t in eligible_types) if entity else False
    checks.append({
        "rule": "E1 - Organisation Type",
        "passed": type_ok,
        "detail": f"'{entity}' {'is' if type_ok else 'is not'} among eligible types: {', '.join(eligible_types)}",
    })

    # E2: Minimum Age (if applicable)
    min_years = programme.get("min_years_operation")
    if min_years:
        current_year = datetime.now().year
        est_year = app.established_year or current_year
        age = current_year - est_year
        age_ok = age >= min_years
        checks.append({
            "rule": "E2 - Minimum Operation Period",
            "passed": age_ok,
            "detail": f"Established {est_year} ({age} years). Minimum required: {min_years} years.",
        })

    # E3: Funding Range
    amount = float(app.total_requested or 0)
    funding_ok = programme["funding_min"] <= amount <= programme["funding_max"]
    checks.append({
        "rule": "E3 - Funding Range",
        "passed": funding_ok,
        "detail": f"Requested INR {amount:,.0f}. Allowed: INR {programme['funding_min']:,.0f} – {programme['funding_max']:,.0f}.",
    })

    # E4: Budget Overhead Cap
    overheads = float(app.budget_overheads or 0)
    cap = programme["overhead_cap_pct"]
    overhead_pct = (overheads / amount * 100) if amount > 0 else 0
    overhead_ok = overhead_pct <= cap
    checks.append({
        "rule": "E4 - Budget Overhead Cap",
        "passed": overhead_ok,
        "detail": f"Overheads are {overhead_pct:.1f}% of total. Cap: {cap}%.",
    })

    # E5: Budget Total Match
    budget_sum = sum(float(getattr(app, f, 0) or 0) for f in [
        "budget_personnel", "budget_equipment", "budget_travel", "budget_overheads", "budget_other",
    ])
    tolerance = programme["budget_tolerance"]
    total_match = abs(budget_sum - amount) <= tolerance
    checks.append({
        "rule": "E5 - Budget Total Match",
        "passed": total_match,
        "detail": f"Budget lines sum to INR {budget_sum:,.0f}. Requested: INR {amount:,.0f}. Tolerance: ±{tolerance}.",
    })

    # Grant-type specific checks
    if grant_type == "EIG":
        schools = int(app.schools_targeted or 0)
        min_schools = programme.get("min_schools_targeted", 5)
        checks.append({
            "rule": "E6 - Minimum Schools Targeted",
            "passed": schools >= min_schools,
            "detail": f"Schools targeted: {schools}. Minimum: {min_schools}.",
        })

        grade = app.grade_coverage or ""
        checks.append({
            "rule": "E7 - Grade Coverage",
            "passed": bool(grade),
            "detail": f"Grade coverage: {'specified' if grade else 'not specified'}.",
        })

    return checks


def _run_soft_checks(app: Any, grant_type: str) -> list[dict]:
    """Run AI-assisted soft checks (thematic alignment, narrative quality)."""
    soft_checks = []

    # Soft Check 1: Thematic Alignment
    alignment = check_thematic_alignment(
        grant_type=grant_type,
        project_title=app.project_title or "",
        problem_statement=app.problem_statement or "",
        proposed_solution=app.proposed_solution or "",
    )
    threshold = {"CDG": 60, "EIG": 65, "ECAG": 60}.get(grant_type, 60)
    score = alignment.get("alignment_score", 0)
    soft_checks.append({
        "check": "Thematic Alignment",
        "score": score,
        "threshold": threshold,
        "flagged": score < threshold,
        "detail": alignment.get("reasoning", ""),
    })

    # Soft Check 2: Narrative Quality
    quality = check_narrative_quality(
        problem_statement=app.problem_statement or "",
        proposed_solution=app.proposed_solution or "",
        outcomes=app.sustainability_plan or "",
    )
    soft_checks.append({
        "check": "Narrative Quality",
        "score": quality.get("quality_score", 0),
        "flagged": quality.get("quality_score", 0) < 60,
        "coherence": quality.get("coherence"),
        "has_measurable_outcome": quality.get("has_measurable_outcome"),
        "flags": quality.get("flags", []),
        "detail": quality.get("reasoning", ""),
    })

    # ECAG-specific: Geographic Priority
    if grant_type == "ECAG":
        location = (app.project_location or "").lower()
        is_priority = any(d.lower() in location for d in CLIMATE_VULNERABLE_DISTRICTS)
        soft_checks.append({
            "check": "Geographic Priority (Climate-Vulnerable District)",
            "flagged": not is_priority,
            "detail": f"Location '{app.project_location}' {'is' if is_priority else 'is not'} in climate-vulnerable district list.",
        })

    return soft_checks


def run_eligibility_precheck(org_type: str, district: str, amount: float) -> list[dict]:
    """Quick eligibility pre-check without login — hard rules only."""
    results = []
    for code, prog in GRANT_PROGRAMMES.items():
        issues = []
        eligible_types = prog.get("eligible_org_types", [])
        if not any(t.lower() in org_type.lower() for t in eligible_types):
            issues.append(f"Organisation type '{org_type}' not eligible (need: {', '.join(eligible_types)})")

        if not (prog["funding_min"] <= amount <= prog["funding_max"]):
            issues.append(f"Amount INR {amount:,.0f} outside range INR {prog['funding_min']:,.0f}–{prog['funding_max']:,.0f}")

        results.append({
            "grant_type": code,
            "programme_name": prog["name"],
            "likely_eligible": len(issues) == 0,
            "reasons": issues,
        })
    return results
