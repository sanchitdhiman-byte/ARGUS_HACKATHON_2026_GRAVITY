"""
Module 6 - Reporting & Compliance
Progress reports, AI compliance analysis, expenditure tracking, and fund utilisation.
"""
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import database, models, schemas, auth, ai_service
from helpers import create_notification, create_audit_log

router = APIRouter(tags=["reporting"])


def _app_to_dict(app: models.Application) -> dict:
    """Convert application model to dict for AI service."""
    return {
        "org_name": app.org_name,
        "project_title": app.project_title,
        "project_location": app.project_location,
        "target_beneficiaries": app.target_beneficiaries,
        "total_requested": app.total_requested,
        "problem_statement": app.problem_statement,
        "proposed_solution": app.proposed_solution,
        "key_activities": app.key_activities,
        "expected_outcomes": app.expected_outcomes,
        "start_date": app.start_date,
        "end_date": app.end_date,
        "milestones": app.milestones,
    }


def _report_to_dict(report: models.Report) -> dict:
    """Convert report model to dict for AI service."""
    return {
        "report_type": report.report_type,
        "period_label": report.period_label,
        "activities_completed": report.activities_completed,
        "activities_not_completed": report.activities_not_completed,
        "beneficiaries_reached": report.beneficiaries_reached,
        "beneficiaries_male": report.beneficiaries_male,
        "beneficiaries_female": report.beneficiaries_female,
        "outcomes_progress": report.outcomes_progress,
        "key_challenges": report.key_challenges,
        "expenditure_period": report.expenditure_period,
        "expenditure_cumulative": report.expenditure_cumulative,
        "variance_explanation": report.variance_explanation,
        "overall_achievement": report.overall_achievement,
        "lessons_learned": report.lessons_learned,
    }


# ─── Reports ─────────────────────────────────────────────────────────────────

@router.get("/applications/{app_id}/reports", response_model=list[schemas.ReportResponse])
def list_reports(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """List all reports for an application."""
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")

    return db.query(models.Report).filter(
        models.Report.application_id == app_id
    ).order_by(models.Report.submitted_at.desc()).all()


@router.get("/reports/{report_id}", response_model=schemas.ReportResponse)
def get_report(
    report_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get a single report."""
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    app = db.query(models.Application).filter(models.Application.id == report.application_id).first()
    if current_user.role == models.RoleEnum.applicant and app and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")

    return report


@router.post("/applications/{app_id}/reports", response_model=schemas.ReportResponse)
def submit_report(
    app_id: int,
    req: schemas.ReportCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Applicant submits a progress report."""
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised to submit reports for this application")

    report = models.Report(
        application_id=app_id,
        report_type=req.report_type,
        period_label=req.period_label,
        due_date=req.due_date,
        submitted_at=datetime.utcnow(),
        status="submitted",
        activities_completed=req.activities_completed,
        activities_not_completed=req.activities_not_completed,
        activities_next_period=req.activities_next_period,
        beneficiaries_reached=req.beneficiaries_reached,
        beneficiaries_male=req.beneficiaries_male,
        beneficiaries_female=req.beneficiaries_female,
        beneficiaries_other=req.beneficiaries_other,
        outcomes_progress=req.outcomes_progress,
        key_challenges=req.key_challenges,
        expenditure_period=req.expenditure_period,
        expenditure_cumulative=req.expenditure_cumulative,
        expenditure_by_line=req.expenditure_by_line,
        variance_explanation=req.variance_explanation,
        plans_next_period=req.plans_next_period,
        support_needed=req.support_needed,
        overall_achievement=req.overall_achievement,
        final_beneficiaries=req.final_beneficiaries,
        key_outcomes_achieved=req.key_outcomes_achieved,
        lessons_learned=req.lessons_learned,
        sustainability_plan=req.sustainability_plan,
        final_financial_statement=req.final_financial_statement,
    )
    db.add(report)
    db.flush()

    # Trigger AI compliance analysis
    app_data = _app_to_dict(app)
    report_data = _report_to_dict(report)
    ai_result = ai_service.analyze_compliance_report(report_data, app_data)
    report.compliance_analysis = json.dumps(ai_result)
    report.compliance_rating = ai_result.get("content_rating", "needs_clarification")

    # Notify PO
    po_users = db.query(models.User).filter(
        models.User.role.in_([models.RoleEnum.officer, models.RoleEnum.admin])
    ).all()
    for po in po_users:
        create_notification(
            db, po.id, "report_submitted",
            f"New Report: {app.reference_id}",
            f"A {req.report_type} report has been submitted for {app.reference_id} by {app.org_name}. Compliance rating: {report.compliance_rating}.",
            application_id=app_id
        )

    create_audit_log(
        db, current_user.id, current_user.email,
        "report.submitted", "report", report.id,
        detail={"report_type": req.report_type, "compliance_rating": report.compliance_rating}
    )

    db.commit()
    db.refresh(report)
    return report


@router.post("/reports/{report_id}/analyze")
def analyze_report(
    report_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Trigger or re-trigger AI compliance analysis for a report."""
    if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorised")

    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    app = db.query(models.Application).filter(models.Application.id == report.application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app_data = _app_to_dict(app)
    report_data = _report_to_dict(report)
    ai_result = ai_service.analyze_compliance_report(report_data, app_data)

    report.compliance_analysis = json.dumps(ai_result)
    report.compliance_rating = ai_result.get("content_rating", "needs_clarification")
    report.status = "under_review"

    create_audit_log(
        db, current_user.id, current_user.email,
        "report.analyzed", "report", report_id,
        detail={"compliance_rating": report.compliance_rating}
    )

    db.commit()
    return {
        "report_id": report_id,
        "compliance_rating": report.compliance_rating,
        "analysis": ai_result
    }


@router.post("/reports/{report_id}/review")
def review_report(
    report_id: int,
    req: schemas.ReportReviewRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Programme Officer reviews and acts on a submitted report."""
    if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Only Programme Officers can review reports")

    valid_actions = ["approved", "clarification_requested", "compliance_action"]
    if req.action not in valid_actions:
        raise HTTPException(status_code=400, detail=f"Action must be one of: {valid_actions}")

    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    app = db.query(models.Application).filter(models.Application.id == report.application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    report.po_action = req.action
    report.po_action_reason = req.reason
    report.compliance_severity = req.severity if req.action == "compliance_action" else None
    report.reviewed_by = current_user.id
    report.reviewed_at = datetime.utcnow()
    report.status = req.action

    # If approved: trigger any milestone-linked disbursement
    if req.action == "approved":
        milestone_tranche = db.query(models.DisbursementTranche).filter(
            models.DisbursementTranche.application_id == app.id,
            models.DisbursementTranche.tranche_type.in_(["mid_project", "milestone"]),
            models.DisbursementTranche.status == "pending"
        ).first()
        if milestone_tranche:
            milestone_tranche.status = "ready"

        create_notification(
            db, app.applicant_id, "report_approved",
            f"Report Approved: {app.reference_id}",
            f"Your {report.report_type} report for {app.reference_id} has been approved. {req.reason}",
            application_id=app.id
        )

    elif req.action == "compliance_action" and req.severity == "disbursement_hold":
        # Notify Finance Officers
        finance_users = db.query(models.User).filter(
            models.User.role == models.RoleEnum.finance
        ).all()
        for fo in finance_users:
            create_notification(
                db, fo.id, "disbursement_hold",
                f"Disbursement Hold: {app.reference_id}",
                f"A disbursement hold has been placed on {app.reference_id} due to compliance concerns. Reason: {req.reason}",
                application_id=app.id
            )
        create_notification(
            db, app.applicant_id, "compliance_action",
            f"Compliance Action: {app.reference_id}",
            f"A compliance action has been raised for your report. Disbursements are on hold. Reason: {req.reason}",
            application_id=app.id
        )

    else:
        create_notification(
            db, app.applicant_id, f"report_{req.action}",
            f"Report Update: {app.reference_id}",
            f"Your {report.report_type} report for {app.reference_id} requires attention: {req.reason}",
            application_id=app.id
        )

    create_audit_log(
        db, current_user.id, current_user.email,
        f"report.{req.action}", "report", report_id,
        detail={"action": req.action, "reason": req.reason, "severity": req.severity}
    )

    db.commit()
    return {"message": f"Report action '{req.action}' recorded"}


# ─── Expenditure ─────────────────────────────────────────────────────────────

@router.get("/applications/{app_id}/expenditures", response_model=list[schemas.ExpenditureResponse])
def list_expenditures(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """List all expenditure records for an application."""
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")

    return db.query(models.ExpenditureRecord).filter(
        models.ExpenditureRecord.application_id == app_id
    ).order_by(models.ExpenditureRecord.submitted_at.desc()).all()


@router.post("/applications/{app_id}/expenditures", response_model=schemas.ExpenditureResponse)
def submit_expenditure(
    app_id: int,
    req: schemas.ExpenditureCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Submit an expenditure record."""
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")

    record = models.ExpenditureRecord(
        application_id=app_id,
        date=req.date,
        payee=req.payee,
        amount=req.amount,
        budget_category=req.budget_category,
        description=req.description,
        submitted_by=current_user.id,
        status="pending"
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.put("/expenditures/{record_id}/status", response_model=schemas.ExpenditureResponse)
def update_expenditure_status(
    record_id: int,
    req: schemas.ExpenditureStatusUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Finance Officer verifies or queries an expenditure record."""
    if current_user.role not in [models.RoleEnum.finance, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Only Finance Officers can verify expenditures")

    valid_statuses = ["verified", "queried"]
    if req.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of: {valid_statuses}")

    record = db.query(models.ExpenditureRecord).filter(
        models.ExpenditureRecord.id == record_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Expenditure record not found")

    record.status = req.status
    record.verified_by = current_user.id

    db.commit()
    db.refresh(record)
    return record


@router.get("/applications/{app_id}/fund-utilisation")
def fund_utilisation(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Summary of budget vs actuals and disbursements for an application."""
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")

    # Disbursements
    tranches = db.query(models.DisbursementTranche).filter(
        models.DisbursementTranche.application_id == app_id
    ).all()
    total_disbursed = sum(t.amount for t in tranches if t.status == "disbursed")
    total_committed = sum(t.amount for t in tranches)

    # Expenditures
    expenditures = db.query(models.ExpenditureRecord).filter(
        models.ExpenditureRecord.application_id == app_id
    ).all()
    total_expended = sum(e.amount for e in expenditures)
    verified_expended = sum(e.amount for e in expenditures if e.status == "verified")

    # By category
    by_category = {}
    for e in expenditures:
        cat = e.budget_category or "other"
        by_category[cat] = by_category.get(cat, 0) + e.amount

    # Budget breakdown
    budget = {
        "personnel": app.budget_personnel or 0,
        "equipment": app.budget_equipment or 0,
        "travel": app.budget_travel or 0,
        "overheads": app.budget_overheads or 0,
        "other": app.budget_other or 0,
    }

    return {
        "application_id": app_id,
        "reference_id": app.reference_id,
        "total_approved": app.total_requested or 0,
        "total_disbursed": total_disbursed,
        "total_committed": total_committed,
        "total_expended": total_expended,
        "verified_expended": verified_expended,
        "balance": (app.total_requested or 0) - total_expended,
        "utilisation_rate": (total_expended / app.total_requested * 100) if app.total_requested else 0,
        "approved_budget": budget,
        "actual_by_category": by_category,
        "disbursements": [
            {
                "id": t.id,
                "label": t.label,
                "amount": t.amount,
                "tranche_type": t.tranche_type,
                "status": t.status,
                "disbursed_at": t.disbursed_at,
            }
            for t in tranches
        ]
    }
