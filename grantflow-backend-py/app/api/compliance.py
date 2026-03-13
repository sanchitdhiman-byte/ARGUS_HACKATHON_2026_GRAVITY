"""Compliance reporting, AI analysis, and fund utilisation."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import (
    ComplianceReport, Application, Disbursement, User, RoleEnum, AuditLog,
)
from app.schemas.schemas import (
    ComplianceReportCreate, ComplianceReportResponse,
    ComplianceReviewAction, DisbursementCreate, DisbursementResponse,
    NotificationResponse,
)
from app.models.models import Notification
from app.core.security import get_current_user
from app.services.ai_agent import analyse_compliance_report
from app.services.notification import notify_report_approved

router = APIRouter(tags=["Compliance & Finance"])


# ── Report Submission ─────────────────────────────────────────────────

@router.post("/compliance-reports", response_model=ComplianceReportResponse)
def submit_compliance_report(
    report: ComplianceReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    app = db.query(Application).filter(Application.id == report.application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if current_user.role == RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    new_report = ComplianceReport(
        application_id=report.application_id,
        report_type=report.report_type,
        report_data=report.report_data,
        due_date=datetime.utcnow(),
        submitted_date=datetime.utcnow(),
        status="submitted",
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # Auto AI analysis
    app_dict = {c.name: getattr(app, c.name) for c in app.__table__.columns}
    analysis = analyse_compliance_report(report.report_data, app_dict)
    new_report.ai_analysis = analysis
    new_report.status = "under_review"

    db.add(AuditLog(actor_id=current_user.id, action="submit_report", object_type="compliance_report", object_id=new_report.id))
    db.commit()
    db.refresh(new_report)

    return new_report


@router.get("/compliance-reports", response_model=list[ComplianceReportResponse])
def list_compliance_reports(
    application_id: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(ComplianceReport)
    if application_id:
        query = query.filter(ComplianceReport.application_id == application_id)
    if current_user.role == RoleEnum.applicant:
        app_ids = [a.id for a in db.query(Application).filter(Application.applicant_id == current_user.id).all()]
        query = query.filter(ComplianceReport.application_id.in_(app_ids))
    return query.order_by(ComplianceReport.submitted_date.desc()).all()


@router.get("/compliance-reports/{report_id}", response_model=ComplianceReportResponse)
def get_compliance_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = db.query(ComplianceReport).filter(ComplianceReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


# ── Officer Review ────────────────────────────────────────────────────

@router.post("/compliance-reports/{report_id}/review")
def review_compliance_report(
    report_id: int,
    action: ComplianceReviewAction,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in [RoleEnum.officer, RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorized")

    report = db.query(ComplianceReport).filter(ComplianceReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.officer_comments = action.comments

    if action.action == "approve":
        report.status = "approved"
        app = db.query(Application).filter(Application.id == report.application_id).first()
        if app:
            notify_report_approved(db, app.applicant_id, app.reference_id)
            # Trigger milestone-linked disbursement
            pending = db.query(Disbursement).filter(
                Disbursement.application_id == report.application_id,
                Disbursement.status == "pending",
            ).first()
            if pending:
                pending.status = "ready"

    elif action.action == "request_clarification":
        report.status = "clarification_needed"
    elif action.action == "flag_compliance":
        report.status = "flagged"
        if action.severity == "disbursement_hold":
            # Hold all pending disbursements
            db.query(Disbursement).filter(
                Disbursement.application_id == report.application_id,
                Disbursement.status == "pending",
            ).update({"status": "hold"})

    db.add(AuditLog(actor_id=current_user.id, action=f"review_report_{action.action}",
                     object_type="compliance_report", object_id=report_id))
    db.commit()
    return {"message": f"Report {action.action} completed"}


# ── Disbursements ─────────────────────────────────────────────────────

@router.post("/disbursements", response_model=DisbursementResponse)
def create_disbursement(
    data: DisbursementCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in [RoleEnum.officer, RoleEnum.admin, RoleEnum.finance]:
        raise HTTPException(status_code=403, detail="Not authorized")

    disbursement = Disbursement(
        application_id=data.application_id,
        amount=data.amount,
        tranche_name=data.tranche_name,
        trigger_condition=data.trigger_condition,
        status="pending",
    )
    db.add(disbursement)
    db.add(AuditLog(actor_id=current_user.id, action="create_disbursement", object_type="disbursement",
                     object_id=data.application_id))
    db.commit()
    db.refresh(disbursement)
    return disbursement


@router.get("/disbursements", response_model=list[DisbursementResponse])
def list_disbursements(
    application_id: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in [RoleEnum.officer, RoleEnum.admin, RoleEnum.finance]:
        raise HTTPException(status_code=403, detail="Not authorized")

    query = db.query(Disbursement)
    if application_id:
        query = query.filter(Disbursement.application_id == application_id)
    return query.all()


@router.post("/disbursements/{disbursement_id}/release")
def release_disbursement(
    disbursement_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in [RoleEnum.finance, RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorized")

    d = db.query(Disbursement).filter(Disbursement.id == disbursement_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Disbursement not found")
    if d.status not in ["pending", "ready"]:
        raise HTTPException(status_code=400, detail=f"Cannot release disbursement in '{d.status}' status")

    d.status = "disbursed"
    d.disbursed_date = datetime.utcnow()
    db.add(AuditLog(actor_id=current_user.id, action="release_disbursement", object_type="disbursement", object_id=d.id))
    db.commit()
    return {"message": f"Disbursement {d.tranche_name} of INR {d.amount:,.0f} released"}


# ── Notifications ─────────────────────────────────────────────────────

@router.get("/notifications", response_model=list[NotificationResponse])
def get_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).limit(50).all()


@router.post("/notifications/{notif_id}/read")
def mark_notification_read(notif_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notif_id, Notification.user_id == current_user.id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"message": "Marked as read"}


# ── Fund Utilisation Dashboard ────────────────────────────────────────

@router.get("/dashboard/fund-utilisation")
def fund_utilisation_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in [RoleEnum.officer, RoleEnum.admin, RoleEnum.finance]:
        raise HTTPException(status_code=403, detail="Not authorized")

    from app.models.models import ApplicationStatusEnum

    active_statuses = [
        ApplicationStatusEnum.approved, ApplicationStatusEnum.active_reporting,
        ApplicationStatusEnum.agreement_acknowledged,
    ]
    active_apps = db.query(Application).filter(Application.status.in_(active_statuses)).all()

    total_committed = sum(a.total_requested or 0 for a in active_apps)
    all_disbursements = db.query(Disbursement).all()
    total_disbursed = sum(d.amount for d in all_disbursements if d.status == "disbursed")
    total_pending = sum(d.amount for d in all_disbursements if d.status in ["pending", "ready"])

    all_apps = db.query(Application).all()
    status_counts = {}
    for a in all_apps:
        s = a.status.value if a.status else "unknown"
        status_counts[s] = status_counts.get(s, 0) + 1

    return {
        "total_committed": total_committed,
        "total_disbursed": total_disbursed,
        "total_pending_disbursement": total_pending,
        "active_grant_count": len(active_apps),
        "grants_by_status": status_counts,
    }
