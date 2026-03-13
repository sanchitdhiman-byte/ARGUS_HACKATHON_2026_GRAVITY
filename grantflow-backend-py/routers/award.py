"""
Module 5 - Award & Disbursement
Decision making, grant agreement generation, tranche management, and bank details.
"""
import json
import time
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import database, models, schemas, auth
from helpers import create_notification, create_audit_log

router = APIRouter(tags=["award"])


# ─── Agreement Template ──────────────────────────────────────────────────────

AGREEMENT_TEMPLATE = """
GRANT AGREEMENT

Grant Reference: {grant_reference}
Date: {agreement_date}

BETWEEN:
  ARGUS Foundation ("Grantor")
  AND
  {grantee_org_name} ("Grantee")

PROJECT DETAILS:
  Project Title: {project_title}
  Grant Type: {grant_type}
  Project Location: {project_location}
  Grant Amount: ₹{grant_amount}
  Project Duration: {start_date} to {end_date}

1. GRANT PURPOSE
   The Grantor agrees to provide a grant of ₹{grant_amount} to the Grantee for the purpose of
   implementing the project titled "{project_title}" as described in the approved application
   reference {reference_id}.

2. GRANT CONDITIONS
   2.1 The Grantee shall implement the project in accordance with the approved application and budget.
   2.2 The Grantee shall submit progress reports as specified in the reporting schedule.
   2.3 The Grantee shall maintain proper accounts and make them available for audit.
   2.4 Funds shall be used exclusively for project purposes and not diverted.
   2.5 Any changes to project scope or budget exceeding 10% require prior written approval.

3. DISBURSEMENT SCHEDULE
{disbursement_schedule}

4. REPORTING OBLIGATIONS
   The Grantee shall submit:
   - Progress reports every 6 months from project start date
   - Final report within 60 days of project end date
   - Audited utilisation certificate within 90 days of project end date

5. SPECIAL CONDITIONS
{special_conditions}

6. TERMINATION
   The Grantor may terminate this agreement if:
   - The Grantee fails to comply with reporting requirements
   - Funds are found to have been misused
   - The project is abandoned or substantially altered without approval

7. ACKNOWLEDGEMENT
   The Grantee acknowledges receipt of this agreement and agrees to all terms and conditions.

_______________________________          _______________________________
For ARGUS Foundation                     For {grantee_org_name}
Programme Officer                        Authorised Signatory: {signatory_name}
Date: {agreement_date}                   Date: ________________________
"""


def _format_disbursement_schedule(tranches: list) -> str:
    if not tranches:
        return "   To be determined."
    lines = []
    for i, t in enumerate(tranches, 1):
        lines.append(
            f"   Tranche {i} ({t.get('label', 'Tranche')}): ₹{t.get('amount', 0):,.0f} "
            f"— Type: {t.get('tranche_type', '')} "
            f"— Trigger: {t.get('trigger_condition', '')}"
        )
    return "\n".join(lines)


# ─── Decision ────────────────────────────────────────────────────────────────

@router.post("/applications/{app_id}/decision")
def make_decision(
    app_id: int,
    req: schemas.DecisionRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Programme Officer makes final grant decision: approved/rejected/waitlisted."""
    if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Only Programme Officers can make award decisions")

    valid_decisions = ["approved", "rejected", "waitlisted"]
    if req.decision not in valid_decisions:
        raise HTTPException(status_code=400, detail=f"Decision must be one of: {valid_decisions}")

    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.final_decision = req.decision
    app.decision_reason = req.reason
    app.decision_by = current_user.id
    app.decision_at = datetime.utcnow()

    status_map = {
        "approved": models.ApplicationStatusEnum.approved,
        "rejected": models.ApplicationStatusEnum.rejected,
        "waitlisted": models.ApplicationStatusEnum.waitlisted,
    }
    app.status = status_map[req.decision]

    notif_map = {
        "approved": (
            "application_approved",
            f"Congratulations! Application {app.reference_id} Approved",
            f"We are pleased to inform you that your application {app.reference_id} for the {app.grant_type} has been approved. You will receive the grant agreement shortly."
        ),
        "rejected": (
            "application_rejected",
            f"Application {app.reference_id} — Decision",
            f"We regret to inform you that your application {app.reference_id} was not selected for funding. Reason: {req.reason}"
        ),
        "waitlisted": (
            "application_waitlisted",
            f"Application {app.reference_id} Waitlisted",
            f"Your application {app.reference_id} has been waitlisted. We will notify you if funding becomes available."
        ),
    }
    event_type, title, content = notif_map[req.decision]
    create_notification(db, app.applicant_id, event_type, title, content, application_id=app_id)

    create_audit_log(
        db, current_user.id, current_user.email,
        f"application.{req.decision}", "application", app_id,
        detail={"decision": req.decision, "reason": req.reason}
    )

    db.commit()
    return {"message": f"Application {req.decision}", "application_id": app_id, "status": app.status}


# ─── Grant Agreement ─────────────────────────────────────────────────────────

@router.post("/applications/{app_id}/generate-agreement", response_model=schemas.GrantAgreementResponse)
def generate_agreement(
    app_id: int,
    req: schemas.GenerateAgreementRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Generate a grant agreement with disbursement tranches."""
    if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorised")

    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if app.final_decision != "approved":
        raise HTTPException(status_code=400, detail="Application must be approved before generating agreement")

    # Check if agreement already exists
    existing = db.query(models.GrantAgreement).filter(
        models.GrantAgreement.application_id == app_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Agreement already exists for this application")

    grant_ref = f"GA-{app.grant_type}-{app.id}-{int(time.time()) % 100000}"
    today = datetime.utcnow().strftime("%d %B %Y")

    tranches_data = [t.model_dump() for t in req.disbursement_tranches]
    disbursement_schedule_text = _format_disbursement_schedule(tranches_data)

    agreement_text = AGREEMENT_TEMPLATE.format(
        grant_reference=grant_ref,
        agreement_date=today,
        grantee_org_name=app.org_name or "Grantee Organisation",
        project_title=app.project_title or "Project",
        grant_type=app.grant_type,
        project_location=app.project_location or "India",
        grant_amount=f"{app.total_requested:,.0f}" if app.total_requested else "0",
        start_date=app.start_date or "TBD",
        end_date=app.end_date or "TBD",
        reference_id=app.reference_id,
        disbursement_schedule=disbursement_schedule_text,
        special_conditions=req.special_conditions or "   None.",
        signatory_name=app.signatory_name or "Authorised Representative",
    )

    agreement = models.GrantAgreement(
        application_id=app_id,
        grant_reference=grant_ref,
        agreement_text=agreement_text,
        special_conditions=req.special_conditions,
        generated_by=current_user.id,
        sent_at=datetime.utcnow(),
        status="sent"
    )
    db.add(agreement)
    db.flush()

    # Create disbursement tranches
    for t in req.disbursement_tranches:
        tranche = models.DisbursementTranche(
            application_id=app_id,
            label=t.label,
            amount=t.amount,
            tranche_type=t.tranche_type,
            trigger_condition=t.trigger_condition,
            status="pending"
        )
        db.add(tranche)

    # Update application status
    app.status = models.ApplicationStatusEnum.agreement_sent

    # Notify applicant
    create_notification(
        db, app.applicant_id, "agreement_sent",
        f"Grant Agreement Ready: {app.reference_id}",
        f"Your grant agreement for {app.reference_id} is ready. Please log in to review and acknowledge the agreement.",
        application_id=app_id
    )

    create_audit_log(
        db, current_user.id, current_user.email,
        "agreement.generated", "grant_agreement", agreement.id,
        detail={"grant_reference": grant_ref, "tranches": len(req.disbursement_tranches)}
    )

    db.commit()
    db.refresh(agreement)
    return agreement


@router.get("/agreements/{agreement_id}", response_model=schemas.GrantAgreementResponse)
def get_agreement(
    agreement_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get a grant agreement."""
    agreement = db.query(models.GrantAgreement).filter(
        models.GrantAgreement.id == agreement_id
    ).first()
    if not agreement:
        raise HTTPException(status_code=404, detail="Agreement not found")

    # Check access
    app = db.query(models.Application).filter(
        models.Application.id == agreement.application_id
    ).first()
    if current_user.role == models.RoleEnum.applicant and app and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")

    return agreement


@router.post("/agreements/{agreement_id}/acknowledge")
def acknowledge_agreement(
    agreement_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Applicant acknowledges the grant agreement."""
    agreement = db.query(models.GrantAgreement).filter(
        models.GrantAgreement.id == agreement_id
    ).first()
    if not agreement:
        raise HTTPException(status_code=404, detail="Agreement not found")

    app = db.query(models.Application).filter(
        models.Application.id == agreement.application_id
    ).first()

    if app and current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised to acknowledge this agreement")

    if agreement.acknowledged_at:
        raise HTTPException(status_code=400, detail="Agreement already acknowledged")

    agreement.acknowledged_at = datetime.utcnow()
    agreement.status = "acknowledged"

    # Trigger inception tranche if exists
    inception = db.query(models.DisbursementTranche).filter(
        models.DisbursementTranche.application_id == agreement.application_id,
        models.DisbursementTranche.tranche_type == "inception",
        models.DisbursementTranche.status == "pending"
    ).first()
    if inception:
        inception.status = "ready"

    # Update application to active
    if app:
        app.status = models.ApplicationStatusEnum.active

    create_notification(
        db, app.applicant_id if app else current_user.id,
        "agreement_acknowledged",
        f"Agreement Acknowledged: {app.reference_id if app else ''}",
        "Your grant agreement has been acknowledged. Your project is now active. The inception tranche will be disbursed shortly.",
        application_id=agreement.application_id
    )

    create_audit_log(
        db, current_user.id, current_user.email,
        "agreement.acknowledged", "grant_agreement", agreement_id,
        detail={"application_id": agreement.application_id}
    )

    db.commit()
    return {"message": "Agreement acknowledged. Project is now active."}


# ─── Tranches ────────────────────────────────────────────────────────────────

@router.get("/applications/{app_id}/tranches", response_model=list[schemas.DisbursementTrancheResponse])
def get_tranches(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """List all disbursement tranches for an application."""
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")

    return db.query(models.DisbursementTranche).filter(
        models.DisbursementTranche.application_id == app_id
    ).all()


@router.post("/tranches/{tranche_id}/disburse")
def disburse_tranche(
    tranche_id: int,
    req: schemas.DisburseRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Finance Officer marks a tranche as disbursed."""
    if current_user.role not in [models.RoleEnum.finance, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Only Finance Officers can record disbursements")

    tranche = db.query(models.DisbursementTranche).filter(
        models.DisbursementTranche.id == tranche_id
    ).first()
    if not tranche:
        raise HTTPException(status_code=404, detail="Tranche not found")

    if tranche.status == "disbursed":
        raise HTTPException(status_code=400, detail="Tranche already disbursed")

    if tranche.status not in ["ready", "pending"]:
        raise HTTPException(status_code=400, detail=f"Tranche status '{tranche.status}' cannot be disbursed")

    tranche.status = "disbursed"
    tranche.disbursed_at = datetime.utcnow()
    tranche.disbursed_by = current_user.id

    # Notify applicant
    app = db.query(models.Application).filter(
        models.Application.id == tranche.application_id
    ).first()
    if app:
        create_notification(
            db, app.applicant_id, "tranche_disbursed",
            f"Grant Disbursement: {tranche.label}",
            f"₹{tranche.amount:,.0f} ({tranche.label}) has been disbursed for your project {app.reference_id}. {req.notes or ''}",
            application_id=app.id
        )

    create_audit_log(
        db, current_user.id, current_user.email,
        "tranche.disbursed", "disbursement_tranche", tranche_id,
        detail={"amount": tranche.amount, "label": tranche.label, "notes": req.notes}
    )

    db.commit()
    return {
        "message": f"Tranche '{tranche.label}' marked as disbursed",
        "amount": tranche.amount,
        "disbursed_at": tranche.disbursed_at
    }


# ─── Bank Details ────────────────────────────────────────────────────────────

@router.get("/applications/{app_id}/bank-details", response_model=schemas.BankDetailsResponse)
def get_bank_details(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get bank details for an application. Finance Officer and admin only."""
    if current_user.role not in [models.RoleEnum.finance, models.RoleEnum.admin, models.RoleEnum.officer]:
        raise HTTPException(status_code=403, detail="Not authorised to view bank details")

    details = db.query(models.BankDetails).filter(
        models.BankDetails.application_id == app_id
    ).first()
    if not details:
        raise HTTPException(status_code=404, detail="Bank details not found for this application")
    return details


@router.post("/applications/{app_id}/bank-details", response_model=schemas.BankDetailsResponse)
def add_bank_details(
    app_id: int,
    req: schemas.BankDetailsCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Add or update bank details for an application. Finance Officer and admin only."""
    if current_user.role not in [models.RoleEnum.finance, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Only Finance Officers can manage bank details")

    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    existing = db.query(models.BankDetails).filter(
        models.BankDetails.application_id == app_id
    ).first()

    if existing:
        existing.account_number = req.account_number
        existing.ifsc_code = req.ifsc_code
        existing.beneficiary_name = req.beneficiary_name
        existing.bank_name = req.bank_name
        existing.added_by = current_user.id
        existing.added_at = datetime.utcnow()
        details = existing
    else:
        details = models.BankDetails(
            application_id=app_id,
            account_number=req.account_number,
            ifsc_code=req.ifsc_code,
            beneficiary_name=req.beneficiary_name,
            bank_name=req.bank_name,
            added_by=current_user.id
        )
        db.add(details)

    create_audit_log(
        db, current_user.id, current_user.email,
        "bank_details.updated", "bank_details", app_id,
        detail={"beneficiary_name": req.beneficiary_name, "ifsc": req.ifsc_code}
    )

    db.commit()
    db.refresh(details)
    return details
