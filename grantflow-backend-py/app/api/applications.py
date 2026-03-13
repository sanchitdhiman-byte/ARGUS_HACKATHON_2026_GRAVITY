"""Application intake, listing, status management, and screening."""

import time
import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import (
    Application, User, RoleEnum, ApplicationStatusEnum, AuditLog, Message,
)
from app.schemas.schemas import (
    ApplicationCreate, ApplicationResponse, ApplicationDetailResponse,
    ApplicationStatusUpdate, ScreeningOverride, EligibilityPreCheck,
    MessageCreate, MessageResponse,
)
from app.core.security import get_current_user
from app.core.grant_metadata import validate_application_fields, get_budget_rules
from app.services.screening import run_screening, run_eligibility_precheck
from app.services.ai_agent import generate_review_package
from app.services.notification import (
    notify_application_submitted, notify_screening_result,
    notify_award_decision, notify_clarification_requested,
)

router = APIRouter(tags=["Applications"])


def _parse_float(val) -> float:
    try:
        return float(val) if val else 0.0
    except (ValueError, TypeError):
        return 0.0


def _parse_int(val) -> int:
    try:
        return int(val) if val else 0
    except (ValueError, TypeError):
        return 0


# ── Public Endpoints ───────────────────────────────────────────────────

@router.post("/eligibility-check")
def eligibility_precheck(data: EligibilityPreCheck):
    """Public eligibility pre-check — no login required."""
    return run_eligibility_precheck(data.organisation_type, data.project_district, data.funding_amount)


# ── Application CRUD ──────────────────────────────────────────────────

@router.post("/applications", response_model=ApplicationResponse)
def create_application(
    app_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    fd = app_data.formData
    grant_type = app_data.grantType

    # Validate fields against grant metadata (budget rules, required fields)
    validation_errors = validate_application_fields(grant_type, fd)
    if validation_errors:
        raise HTTPException(status_code=422, detail=validation_errors)

    ref_id = f"APP-{grant_type}-{datetime.now().year}-{int(time.time() * 1000) % 10000}X"
    req_amt = _parse_float(fd.get("totalRequested"))

    new_app = Application(
        reference_id=ref_id,
        applicant_id=current_user.id,
        grant_type=app_data.grantType,
        # Organisation
        org_name=fd.get("orgName"),
        reg_number=fd.get("regNumber"),
        entity_type=fd.get("entityType"),
        established_year=_parse_int(fd.get("establishedYear")),
        org_budget=_parse_float(fd.get("budget")),
        contact_name=fd.get("contactName"),
        contact_role=fd.get("contactRole"),
        contact_email=fd.get("email"),
        contact_phone=fd.get("phone"),
        address=fd.get("address"),
        city=fd.get("city"),
        state_region=fd.get("stateRegion"),
        postal_code=fd.get("postalCode"),
        # Project
        project_title=fd.get("projectTitle"),
        project_location=fd.get("projectLocation"),
        target_beneficiaries=_parse_int(fd.get("targetBeneficiaries")),
        problem_statement=fd.get("problemStatement"),
        proposed_solution=fd.get("proposedSolution"),
        sustainability_plan=fd.get("sustainabilityPlan"),
        schools_targeted=_parse_int(fd.get("schoolsTargeted")),
        grade_coverage=fd.get("gradeCoverage"),
        # Budget
        total_requested=req_amt,
        budget_personnel=_parse_float(fd.get("personnel")),
        budget_equipment=_parse_float(fd.get("equipment")),
        budget_travel=_parse_float(fd.get("travel")),
        budget_overheads=_parse_float(fd.get("overheads")),
        budget_other=_parse_float(fd.get("other")),
        budget_justification=fd.get("justification"),
        # Experience
        prior_projects=json.dumps(fd.get("priorProjects", [])),
        has_previous_grants=bool(fd.get("hasPreviousGrants")),
        prior_funder=fd.get("priorFunder"),
        prior_amount=_parse_float(fd.get("priorAmount")),
        signatory_name=fd.get("signatoryName"),
        designation=fd.get("designation"),
        submission_date=fd.get("submissionDate"),
        declared=bool(fd.get("declared")),
        status=ApplicationStatusEnum.screening,
    )

    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    # Run auto-screening
    screening_report = run_screening(new_app)
    new_app.screening_report = screening_report
    new_app.screening_completed_at = datetime.utcnow()

    if screening_report["eligible"]:
        new_app.status = ApplicationStatusEnum.pending_review
        # Generate AI review package
        app_dict = {c.name: getattr(new_app, c.name) for c in new_app.__table__.columns}
        new_app.ai_review_package = generate_review_package(app_dict, new_app.grant_type)
        # Set AI scores from the review package
        suggested = (new_app.ai_review_package or {}).get("suggested_scores", {})
        new_app.ai_score_alignment = suggested.get("alignment", {}).get("score", 0)
        new_app.ai_score_feasibility = suggested.get("feasibility", {}).get("score", 0)
        new_app.ai_score_impact = suggested.get("impact", {}).get("score", 0)
        new_app.ai_score = (new_app.ai_score_alignment + new_app.ai_score_feasibility + new_app.ai_score_impact) * 20 // 3
    else:
        new_app.status = ApplicationStatusEnum.ineligible

    # Risk flagging for very high budgets
    if req_amt > 2_000_000:
        new_app.status = ApplicationStatusEnum.risk_flagged

    # Generate summary
    new_app.ai_summary = f"Applicant {fd.get('orgName', 'Unknown')} proposes: {str(fd.get('problemStatement', ''))[:80]}..."

    db.commit()
    db.refresh(new_app)

    # Notifications
    notify_application_submitted(db, current_user.id, ref_id)
    notify_screening_result(db, current_user.id, ref_id, screening_report["eligible"])

    # Audit
    db.add(AuditLog(actor_id=current_user.id, action="submit_application", object_type="application", object_id=new_app.id))
    db.commit()

    return new_app


@router.get("/applications", response_model=list[ApplicationResponse])
def get_applications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == RoleEnum.applicant:
        return db.query(Application).filter(Application.applicant_id == current_user.id).all()
    return db.query(Application).all()


@router.get("/applications/{app_id}", response_model=ApplicationDetailResponse)
def get_application(app_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if current_user.role == RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this application")
    return app


# ── Status Actions ────────────────────────────────────────────────────

@router.post("/applications/{app_id}/assign")
def assign_application(app_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_staff(current_user)
    app = _get_app_or_404(app_id, db)
    app.status = ApplicationStatusEnum.assigned
    db.add(AuditLog(actor_id=current_user.id, action="assign_application", object_type="application", object_id=app_id))
    db.commit()
    return {"message": "Application assigned for review"}


@router.post("/applications/{app_id}/approve")
def approve_application(
    app_id: int,
    body: ApplicationStatusUpdate = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_staff(current_user)
    app = _get_app_or_404(app_id, db)
    app.status = ApplicationStatusEnum.approved
    db.add(AuditLog(actor_id=current_user.id, action="approve_application", object_type="application", object_id=app_id,
                     details={"reason": body.reason if body else None}))
    db.commit()
    notify_award_decision(db, app.applicant_id, app.reference_id, "approved")
    return {"message": "Application approved"}


@router.post("/applications/{app_id}/reject")
def reject_application(
    app_id: int,
    body: ApplicationStatusUpdate = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_staff(current_user)
    app = _get_app_or_404(app_id, db)
    app.status = ApplicationStatusEnum.rejected
    reason = body.reason if body else ""
    db.add(AuditLog(actor_id=current_user.id, action="reject_application", object_type="application", object_id=app_id,
                     details={"reason": reason}))
    db.commit()
    notify_award_decision(db, app.applicant_id, app.reference_id, "rejected", reason)
    return {"message": "Application rejected"}


@router.post("/applications/{app_id}/waitlist")
def waitlist_application(
    app_id: int,
    body: ApplicationStatusUpdate = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_staff(current_user)
    app = _get_app_or_404(app_id, db)
    app.status = ApplicationStatusEnum.waitlisted
    db.commit()
    return {"message": "Application waitlisted"}


# ── Screening Override ────────────────────────────────────────────────

@router.post("/applications/{app_id}/screening-override")
def screening_override(
    app_id: int,
    override: ScreeningOverride,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_staff(current_user)
    app = _get_app_or_404(app_id, db)

    if override.action == "confirm_eligible":
        app.status = ApplicationStatusEnum.pending_review
        # Generate AI review package if not yet generated
        if not app.ai_review_package:
            app_dict = {c.name: getattr(app, c.name) for c in app.__table__.columns}
            app.ai_review_package = generate_review_package(app_dict, app.grant_type)
    elif override.action == "override_ineligible":
        if not override.reason:
            raise HTTPException(status_code=400, detail="Reason required for ineligibility override")
        app.status = ApplicationStatusEnum.ineligible
    elif override.action == "request_clarification":
        if not override.clarification_question:
            raise HTTPException(status_code=400, detail="Clarification question required")
        notify_clarification_requested(db, app.applicant_id, app.reference_id, override.clarification_question)

    db.add(AuditLog(actor_id=current_user.id, action=f"screening_override_{override.action}",
                     object_type="application", object_id=app_id, details={"reason": override.reason}))
    db.commit()
    return {"message": f"Screening override: {override.action}"}


# ── Messages ──────────────────────────────────────────────────────────

@router.get("/applications/{app_id}/messages", response_model=list[MessageResponse])
def get_messages(app_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app = _get_app_or_404(app_id, db)
    query = db.query(Message).filter(Message.application_id == app_id)
    # Hide internal notes from applicants
    if current_user.role == RoleEnum.applicant:
        if app.applicant_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        query = query.filter(Message.is_internal_note == False)
    return query.order_by(Message.created_at).all()


@router.post("/applications/{app_id}/messages", response_model=MessageResponse)
def create_message(
    app_id: int,
    msg: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    app = _get_app_or_404(app_id, db)
    if current_user.role == RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    # Only staff can create internal notes
    if msg.is_internal_note and current_user.role == RoleEnum.applicant:
        raise HTTPException(status_code=403, detail="Applicants cannot create internal notes")

    new_msg = Message(
        application_id=app_id,
        sender_id=current_user.id,
        content=msg.content,
        is_internal_note=msg.is_internal_note,
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return new_msg


# ── Helpers ───────────────────────────────────────────────────────────

def _require_staff(user: User):
    if user.role not in [RoleEnum.officer, RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorized")


def _get_app_or_404(app_id: int, db: Session) -> Application:
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app
