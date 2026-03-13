"""
Module 3 - AI Screening
Automated eligibility checks plus AI soft checks, with PO override capability.
"""
import json
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dateutil.relativedelta import relativedelta
from dateutil.parser import parse as parse_date

import database, models, schemas, auth, ai_service
from helpers import create_notification, create_audit_log

router = APIRouter(tags=["screening"])


# ─── Hard Eligibility Rules ──────────────────────────────────────────────────

def run_hard_checks(app: models.Application, grant_type: str) -> list[dict]:
    """
    Run hard eligibility rules for the given grant type.
    Returns list of check result dicts: {check_id, name, result, detail}
    """
    results = []
    amount = app.total_requested or 0
    entity = (app.entity_type or "").strip().lower()
    established = app.established_year or 0

    def add(check_id, name, passed, detail=""):
        results.append({
            "check_id": check_id,
            "name": name,
            "result": "pass" if passed else "fail",
            "detail": detail
        })

    if grant_type == "CDG":
        allowed = ["ngo", "trust", "section 8 company", "section8 company", "section8"]
        ok = entity in allowed
        add("E1", "Organisation Type", ok,
            f"Type '{app.entity_type}' {'is' if ok else 'is not'} eligible for CDG")

        years = date.today().year - established if established else 0
        add("E2", "Minimum 2 Years Registration", years >= 2,
            f"Organisation registered {years} year(s) ago")

        add("E3", "Geographic Focus Provided", bool(app.project_location),
            "Project location provided" if app.project_location else "No project location specified")

        in_range = 200000 <= amount <= 2000000
        add("E4", "Grant Amount Range (₹2L–₹20L)", in_range,
            f"Requested ₹{amount:,.0f} — {'within' if in_range else 'outside'} range ₹2,00,000–₹20,00,000")

        duration_ok = False
        dur_detail = "Cannot determine duration"
        if app.start_date and app.end_date:
            try:
                start = parse_date(app.start_date)
                end = parse_date(app.end_date)
                delta = relativedelta(end, start)
                months = delta.years * 12 + delta.months
                duration_ok = 6 <= months <= 18
                dur_detail = f"Duration {months} months — {'valid' if duration_ok else 'outside'} 6–18 months"
            except Exception:
                dur_detail = "Invalid date format"
        elif app.submission_date:
            duration_ok = True  # Can't verify without dates, soft pass
            dur_detail = "Duration not fully specified — requires manual verification"
        add("E5", "Duration 6–18 Months", duration_ok, dur_detail)

        overhead = app.budget_overheads or 0
        overhead_ok = overhead <= amount * 0.15 if amount > 0 else True
        add("E6", "Overhead ≤ 15%",  overhead_ok,
            f"Overheads ₹{overhead:,.0f} = {overhead/amount*100:.1f}% of budget" if amount else "N/A")

        budget_sum = sum(filter(None, [
            app.budget_personnel, app.budget_equipment,
            app.budget_travel, app.budget_overheads, app.budget_other
        ]))
        budget_ok = abs(budget_sum - amount) <= 500 if amount > 0 and budget_sum > 0 else True
        add("E7", "Budget Lines Reconcile", budget_ok,
            f"Sum of lines ₹{budget_sum:,.0f} vs total ₹{amount:,.0f} (diff ₹{abs(budget_sum-amount):,.0f})")

    elif grant_type == "EIG":
        allowed = ["ngo", "edtech non-profit", "edtech nonprofit", "research institution", "university"]
        ok = entity in allowed
        add("E1", "Organisation Type", ok,
            f"Type '{app.entity_type}' {'is' if ok else 'is not'} eligible for EIG")

        years = date.today().year - established if established else 0
        add("E2", "Minimum 2 Years Registration", years >= 2,
            f"Organisation registered {years} year(s) ago")

        schools_ok = bool(app.schools_targeted or app.number_of_schools or app.target_schools_districts)
        add("E3", "Targets Schools/Educational Institutions", schools_ok,
            "School targets provided" if schools_ok else "No school targeting information")

        in_range = 500000 <= amount <= 5000000
        add("E4", "Grant Amount Range (₹5L–₹50L)", in_range,
            f"Requested ₹{amount:,.0f} — {'within' if in_range else 'outside'} range")

        duration_ok = False
        dur_detail = "Cannot determine duration"
        if app.start_date and app.end_date:
            try:
                start = parse_date(app.start_date)
                end = parse_date(app.end_date)
                delta = relativedelta(end, start)
                months = delta.years * 12 + delta.months
                duration_ok = 12 <= months <= 24
                dur_detail = f"Duration {months} months — {'valid' if duration_ok else 'outside'} 12–24 months"
            except Exception:
                dur_detail = "Invalid date format"
        else:
            duration_ok = True
            dur_detail = "Duration not fully specified — requires manual verification"
        add("E5", "Duration 12–24 Months", duration_ok, dur_detail)

        tech_ok = bool(app.tech_tools or app.innovation_type or
                       (app.proposed_solution and len(app.proposed_solution) > 50))
        add("E6", "Technology/Innovation Component Present", tech_ok,
            "Technology component identified" if tech_ok else "No clear technology component")

        outcome_ok = bool(app.primary_learning_outcome or app.measurement_plan or app.expected_outcomes)
        add("E7", "Measurable Learning Outcome Defined", outcome_ok,
            "Learning outcome defined" if outcome_ok else "No measurable learning outcome specified")

    elif grant_type == "ECAG":
        allowed = ["ngo", "fpo", "panchayat", "research institution"]
        ok = entity in allowed
        add("E1", "Organisation Type", ok,
            f"Type '{app.entity_type}' {'is' if ok else 'is not'} eligible for ECAG")

        years = date.today().year - established if established else 0
        add("E2", "Minimum 2 Years Registration", years >= 2,
            f"Organisation registered {years} year(s) ago")

        env_ok = bool(app.environmental_problem or app.thematic_area or
                      (app.problem_statement and len(app.problem_statement) > 30))
        add("E3", "Addresses Environmental/Climate Problem", env_ok,
            "Environmental problem described" if env_ok else "No environmental problem identified")

        in_range = 300000 <= amount <= 3000000
        add("E4", "Grant Amount Range (₹3L–₹30L)", in_range,
            f"Requested ₹{amount:,.0f} — {'within' if in_range else 'outside'} range")

        duration_ok = False
        dur_detail = "Cannot determine duration"
        if app.start_date and app.end_date:
            try:
                start = parse_date(app.start_date)
                end = parse_date(app.end_date)
                delta = relativedelta(end, start)
                months = delta.years * 12 + delta.months
                duration_ok = 6 <= months <= 24
                dur_detail = f"Duration {months} months — {'valid' if duration_ok else 'outside'} 6–24 months"
            except Exception:
                dur_detail = "Invalid date format"
        else:
            duration_ok = True
            dur_detail = "Duration not fully specified — requires manual verification"
        add("E5", "Duration 6–24 Months", duration_ok, dur_detail)

        community_ok = bool(app.community_involvement_plan or
                            (app.proposed_solution and "community" in app.proposed_solution.lower()))
        add("E6", "Community Involvement Plan", community_ok,
            "Community involvement described" if community_ok else "No community involvement plan")

        indicators_ok = bool(app.environmental_indicators or app.measurement_plan)
        add("E7", "Measurable Environmental Indicators Defined", indicators_ok,
            "Environmental indicators defined" if indicators_ok else "No measurable indicators")

    return results


# ─── Routes ──────────────────────────────────────────────────────────────────

@router.post("/applications/{app_id}/screen")
def trigger_screening(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Trigger AI screening for an application.
    Runs hard eligibility checks + AI soft checks.
    Only accessible to PO/admin or can be triggered by system on submission.
    """
    if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin, models.RoleEnum.applicant]:
        raise HTTPException(status_code=403, detail="Not authorised to trigger screening")

    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")

    # Run hard checks
    check_results = run_hard_checks(app, app.grant_type)
    failed_hard = [c for c in check_results if c["result"] == "fail"]

    # Build application data dict for AI
    app_data = {
        "org_name": app.org_name,
        "entity_type": app.entity_type,
        "established_year": app.established_year,
        "project_title": app.project_title,
        "project_location": app.project_location,
        "problem_statement": app.problem_statement,
        "proposed_solution": app.proposed_solution,
        "target_beneficiaries": app.target_beneficiaries,
        "total_requested": app.total_requested,
        "budget_overheads": app.budget_overheads,
        "sustainability_plan": app.sustainability_plan,
        "prior_projects": app.prior_projects,
    }

    # AI soft checks
    ai_result = ai_service.screen_application(app_data, app.grant_type)
    thematic_score = ai_result.get("thematic_score", 50)
    narrative_quality = ai_result.get("narrative_quality", "moderate")
    ai_flags = ai_result.get("flags", [])
    ai_summary = ai_result.get("summary", "")

    thematic_flag = thematic_score < 60
    narrative_flag = narrative_quality == "weak"

    # Determine overall result
    if failed_hard:
        overall = "ineligible"
    elif thematic_flag or narrative_flag:
        overall = "needs_review"
    else:
        overall = "eligible"

    # Check if a screening report already exists
    existing = db.query(models.ScreeningReport).filter(
        models.ScreeningReport.application_id == app_id
    ).first()

    if existing:
        existing.generated_at = datetime.utcnow()
        existing.check_results = json.dumps(check_results)
        existing.thematic_alignment_score = thematic_score
        existing.thematic_alignment_flag = thematic_flag
        existing.narrative_quality_flag = narrative_flag
        existing.narrative_quality_detail = narrative_quality + (": " + ", ".join(ai_flags) if ai_flags else "")
        existing.overall_result = overall
        existing.ai_summary = ai_summary
        report = existing
    else:
        report = models.ScreeningReport(
            application_id=app_id,
            check_results=json.dumps(check_results),
            thematic_alignment_score=thematic_score,
            thematic_alignment_flag=thematic_flag,
            narrative_quality_flag=narrative_flag,
            narrative_quality_detail=narrative_quality + (": " + ", ".join(ai_flags) if ai_flags else ""),
            overall_result=overall,
            ai_summary=ai_summary
        )
        db.add(report)

    # Update application screening status
    app.screening_status = "pass" if overall == "eligible" else ("fail" if overall == "ineligible" else "pending")
    if overall == "eligible":
        app.status = models.ApplicationStatusEnum.pending_review
    elif overall == "ineligible":
        app.status = models.ApplicationStatusEnum.risk_flagged
    else:
        app.status = models.ApplicationStatusEnum.screening

    # Notify applicant
    status_text = {
        "eligible": "passed initial screening",
        "ineligible": "did not pass eligibility screening",
        "needs_review": "requires further review before proceeding"
    }.get(overall, "has been screened")

    create_notification(
        db, app.applicant_id, "screening_complete",
        f"Screening Complete: {app.reference_id}",
        f"Your application {app.reference_id} has {status_text}. Please log in to view details.",
        application_id=app_id
    )

    create_audit_log(
        db, current_user.id, current_user.email,
        "application.screened", "application", app_id,
        detail={"overall_result": overall, "failed_checks": len(failed_hard), "thematic_score": thematic_score}
    )

    db.commit()
    db.refresh(report)
    return {
        "screening_report_id": report.id,
        "overall_result": overall,
        "hard_checks": check_results,
        "thematic_alignment_score": thematic_score,
        "narrative_quality": narrative_quality,
        "ai_flags": ai_flags,
        "ai_summary": ai_summary
    }


@router.get("/applications/{app_id}/screening-report", response_model=schemas.ScreeningReportResponse)
def get_screening_report(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get the screening report for an application."""
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")

    report = db.query(models.ScreeningReport).filter(
        models.ScreeningReport.application_id == app_id
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="No screening report found. Run screening first.")
    return report


@router.post("/applications/{app_id}/screening-decision")
def screening_decision(
    app_id: int,
    req: schemas.ScreeningDecisionRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Programme Officer makes a final decision on the screening result.
    Can confirm eligible, override to ineligible, or request clarification.
    """
    if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Only Programme Officers can make screening decisions")

    valid_decisions = ["confirm_eligible", "override_ineligible", "clarification_requested"]
    if req.decision not in valid_decisions:
        raise HTTPException(status_code=400, detail=f"Decision must be one of: {valid_decisions}")

    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    report = db.query(models.ScreeningReport).filter(
        models.ScreeningReport.application_id == app_id
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="No screening report found. Run screening first.")

    report.po_decision = req.decision
    report.po_decision_reason = req.reason
    report.po_reviewed_by = current_user.id
    report.po_reviewed_at = datetime.utcnow()

    # Update application status based on PO decision
    if req.decision == "confirm_eligible":
        app.screening_status = "pass"
        app.status = models.ApplicationStatusEnum.pending_review
        notif_content = f"Your application {app.reference_id} has been confirmed as eligible and is now pending reviewer assignment."
    elif req.decision == "override_ineligible":
        app.screening_status = "fail"
        app.status = models.ApplicationStatusEnum.rejected
        notif_content = f"Your application {app.reference_id} has been determined ineligible. Reason: {req.reason}"
    else:  # clarification_requested
        app.screening_status = "pending"
        app.status = models.ApplicationStatusEnum.screening
        clarification = req.clarification_question or req.reason
        notif_content = f"Clarification requested for your application {app.reference_id}: {clarification}"

    create_notification(
        db, app.applicant_id, f"screening_{req.decision}",
        f"Screening Update: {app.reference_id}",
        notif_content,
        application_id=app_id
    )

    create_audit_log(
        db, current_user.id, current_user.email,
        "screening.decision", "application", app_id,
        detail={"decision": req.decision, "reason": req.reason}
    )

    db.commit()
    return {"message": f"Screening decision '{req.decision}' recorded", "application_status": app.status}
