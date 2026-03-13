"""
Module 2 - Applicant Portal
Org profile management, document vault, and application convenience routes.
Also hosts the core /applications CRUD endpoints for frontend compatibility.
"""
import os
import time
import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import database, models, schemas, auth
from helpers import create_audit_log, create_notification

router = APIRouter(tags=["applicant"])

UPLOAD_BASE = "uploads"


# ─── Org Profile ─────────────────────────────────────────────────────────────

@router.get("/profile", response_model=schemas.OrgProfileResponse)
def get_profile(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get the org profile for the current user."""
    profile = db.query(models.OrganisationProfile).filter(
        models.OrganisationProfile.user_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please create one.")
    return profile


@router.post("/profile", response_model=schemas.OrgProfileResponse)
def upsert_profile(
    data: schemas.OrgProfileCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Create or update the org profile for the current user."""
    profile = db.query(models.OrganisationProfile).filter(
        models.OrganisationProfile.user_id == current_user.id
    ).first()

    if profile:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(profile, field, value)
    else:
        profile = models.OrganisationProfile(
            user_id=current_user.id,
            **data.model_dump()
        )
        db.add(profile)

    db.commit()
    db.refresh(profile)
    return profile


# ─── Document Vault ──────────────────────────────────────────────────────────

@router.get("/documents", response_model=list[schemas.DocumentResponse])
def list_documents(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """List all vault documents for the current user."""
    return db.query(models.Document).filter(
        models.Document.owner_id == current_user.id,
        models.Document.is_vault == True
    ).all()


@router.post("/documents/upload", response_model=schemas.DocumentResponse)
async def upload_document(
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    application_id: int = Form(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Upload a document to the personal vault."""
    user_upload_dir = os.path.join(UPLOAD_BASE, str(current_user.id))
    os.makedirs(user_upload_dir, exist_ok=True)

    safe_filename = file.filename.replace(" ", "_")
    file_path = os.path.join(user_upload_dir, safe_filename)

    file_size = 0
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        file_size = len(content)

    doc = models.Document(
        owner_id=current_user.id,
        application_id=application_id,
        doc_type=doc_type,
        filename=safe_filename,
        file_path=file_path,
        file_size=file_size,
        is_vault=True
    )
    db.add(doc)

    create_audit_log(
        db, current_user.id, current_user.email,
        "document.uploaded", "document",
        detail={"doc_type": doc_type, "filename": safe_filename}
    )
    db.commit()
    db.refresh(doc)
    return doc


@router.delete("/documents/{doc_id}")
def delete_document(
    doc_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Delete a vault document (owner only)."""
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.owner_id != current_user.id and current_user.role not in [models.RoleEnum.admin, models.RoleEnum.officer]:
        raise HTTPException(status_code=403, detail="Not authorised to delete this document")

    # Remove file from disk
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted"}


# ─── Core Application CRUD (kept here for frontend compatibility) ─────────────

def _parse_float(val):
    try:
        return float(val) if val is not None else 0.0
    except (ValueError, TypeError):
        return 0.0


def _parse_int(val):
    try:
        return int(val) if val is not None else 0
    except (ValueError, TypeError):
        return 0


@router.post("/applications", response_model=schemas.ApplicationResponse)
def create_application(
    app_comp: schemas.ApplicationCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Submit a new grant application."""
    ref_id = f"APP-{app_comp.grantType}-2026-{int(time.time() * 1000) % 10000:04d}"
    fd = app_comp.formData
    req_amt = _parse_float(fd.get("totalRequested"))

    # Basic mock AI score on submission
    summary = (
        f"Applicant {fd.get('orgName', 'Unknown')} proposes: "
        f"{str(fd.get('problemStatement', ''))[:80]}... with budget ₹{req_amt:,.0f}"
    )
    base_score = 70
    if len(str(fd.get("problemStatement", ""))) > 100:
        base_score += 10
    if len(str(fd.get("proposedSolution", ""))) > 100:
        base_score += 10
    if req_amt == 0:
        base_score -= 30

    new_app = models.Application(
        reference_id=ref_id,
        applicant_id=current_user.id,
        grant_type=app_comp.grantType,
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
        project_title=fd.get("projectTitle"),
        project_location=fd.get("projectLocation"),
        target_beneficiaries=_parse_int(fd.get("targetBeneficiaries")),
        problem_statement=fd.get("problemStatement"),
        proposed_solution=fd.get("proposedSolution"),
        sustainability_plan=fd.get("sustainabilityPlan"),
        schools_targeted=_parse_int(fd.get("schoolsTargeted")),
        grade_coverage=fd.get("gradeCoverage"),
        total_requested=req_amt,
        budget_personnel=_parse_float(fd.get("personnel")),
        budget_equipment=_parse_float(fd.get("equipment")),
        budget_travel=_parse_float(fd.get("travel")),
        budget_overheads=_parse_float(fd.get("overheads")),
        budget_other=_parse_float(fd.get("other")),
        budget_justification=fd.get("justification"),
        prior_projects=json.dumps(fd.get("priorProjects", [])),
        has_previous_grants=bool(fd.get("hasPreviousGrants")),
        prior_funder=fd.get("priorFunder"),
        prior_amount=_parse_float(fd.get("priorAmount")),
        signatory_name=fd.get("signatoryName"),
        designation=fd.get("designation"),
        submission_date=fd.get("submissionDate"),
        declared=bool(fd.get("declared")),
        # Extended fields from formData
        start_date=fd.get("startDate"),
        end_date=fd.get("endDate"),
        district=fd.get("district"),
        state=fd.get("state") or fd.get("stateRegion"),
        project_type=fd.get("projectType"),
        beneficiary_demographics=fd.get("beneficiaryDemographics"),
        key_activities=json.dumps(fd.get("keyActivities", [])) if fd.get("keyActivities") else None,
        expected_outcomes=fd.get("expectedOutcomes"),
        annual_operating_budget=_parse_float(fd.get("annualOperatingBudget")),
        # EIG fields
        innovation_type=fd.get("innovationType"),
        target_schools_districts=fd.get("targetSchoolsDistricts"),
        number_of_schools=_parse_int(fd.get("numberOfSchools")),
        number_of_students=_parse_int(fd.get("numberOfStudents")),
        grade_levels=fd.get("gradeLevels"),
        tech_tools=fd.get("techTools"),
        evidence_base=fd.get("evidenceBase"),
        team_lead_name=fd.get("teamLeadName"),
        team_size=_parse_int(fd.get("teamSize")),
        team_expertise=fd.get("teamExpertise"),
        key_partners=fd.get("keyPartners"),
        primary_learning_outcome=fd.get("primaryLearningOutcome"),
        measurement_plan=fd.get("measurementPlan"),
        baseline_assessment_plan=fd.get("baselineAssessmentPlan"),
        milestones=json.dumps(fd.get("milestones", [])) if fd.get("milestones") else None,
        budget_technology=_parse_float(fd.get("budgetTechnology")),
        budget_training=_parse_float(fd.get("budgetTraining")),
        budget_content=_parse_float(fd.get("budgetContent")),
        # ECAG fields
        thematic_area=fd.get("thematicArea"),
        environmental_problem=fd.get("environmentalProblem"),
        proposed_intervention=fd.get("proposedIntervention"),
        geographic_coverage=fd.get("geographicCoverage"),
        community_involvement_plan=fd.get("communityInvolvementPlan"),
        environmental_indicators=json.dumps(fd.get("environmentalIndicators", [])) if fd.get("environmentalIndicators") else None,
        climate_vulnerability_context=fd.get("climateVulnerabilityContext"),
        risk_of_not_acting=fd.get("riskOfNotActing"),
        government_partnerships=fd.get("governmentPartnerships"),
        activity_plan=json.dumps(fd.get("activityPlan", [])) if fd.get("activityPlan") else None,
        budget_community_wages=_parse_float(fd.get("budgetCommunityWages")),
        budget_saplings=_parse_float(fd.get("budgetSaplings")),
        budget_technical_expertise=_parse_float(fd.get("budgetTechnicalExpertise")),
        status=models.ApplicationStatusEnum.screening,
        screening_status="pending",
        ai_score=min(100, max(0, base_score)),
        ai_summary=summary,
    )
    db.add(new_app)

    create_audit_log(
        db, current_user.id, current_user.email,
        "application.submitted", "application",
        detail={"grant_type": app_comp.grantType, "amount": req_amt}
    )

    # Notify PO/admin of new application
    staff = db.query(models.User).filter(
        models.User.role.in_([models.RoleEnum.officer, models.RoleEnum.admin])
    ).all()
    db.commit()
    db.refresh(new_app)

    for s in staff:
        create_notification(
            db, s.id, "application_submitted",
            f"New Application: {new_app.reference_id}",
            f"A new {app_comp.grantType} application has been submitted by {new_app.org_name}.",
            application_id=new_app.id
        )
    db.commit()

    return schemas.ApplicationResponse(
        id=new_app.id,
        reference_id=new_app.reference_id,
        applicant_id=new_app.applicant_id,
        status=new_app.status,
        grant_type=new_app.grant_type,
        org_name=new_app.org_name or "",
        requested_amount=new_app.total_requested or 0.0,
        submitted_at=new_app.submitted_at,
        ai_score=new_app.ai_score or 0,
        ai_summary=new_app.ai_summary,
        screening_status=new_app.screening_status,
        final_decision=new_app.final_decision,
    )


@router.get("/applications", response_model=list[schemas.ApplicationResponse])
def get_applications(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """List applications (all for staff, own for applicants)."""
    if current_user.role == models.RoleEnum.applicant:
        apps = db.query(models.Application).filter(
            models.Application.applicant_id == current_user.id
        ).all()
    else:
        apps = db.query(models.Application).all()

    result = []
    for app in apps:
        result.append(schemas.ApplicationResponse(
            id=app.id,
            reference_id=app.reference_id,
            applicant_id=app.applicant_id,
            status=app.status,
            grant_type=app.grant_type,
            org_name=app.org_name or "",
            requested_amount=app.total_requested or 0.0,
            submitted_at=app.submitted_at,
            ai_score=app.ai_score or 0,
            ai_summary=app.ai_summary,
            screening_status=app.screening_status,
            final_decision=app.final_decision,
        ))
    return result


@router.get("/applications/{app_id}", response_model=schemas.ApplicationDetailResponse)
def get_application(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get full application detail."""
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised to view this application")

    return schemas.ApplicationDetailResponse(
        id=app.id,
        reference_id=app.reference_id,
        applicant_id=app.applicant_id,
        status=app.status,
        grant_type=app.grant_type,
        org_name=app.org_name or "",
        requested_amount=app.total_requested or 0.0,
        submitted_at=app.submitted_at,
        ai_score=app.ai_score or 0,
        ai_summary=app.ai_summary,
        reg_number=app.reg_number,
        entity_type=app.entity_type,
        established_year=app.established_year,
        org_budget=app.org_budget,
        contact_name=app.contact_name,
        contact_role=app.contact_role,
        contact_email=app.contact_email,
        contact_phone=app.contact_phone,
        address=app.address,
        city=app.city,
        state_region=app.state_region,
        postal_code=app.postal_code,
        project_title=app.project_title,
        project_location=app.project_location,
        target_beneficiaries=app.target_beneficiaries,
        problem_statement=app.problem_statement,
        proposed_solution=app.proposed_solution,
        sustainability_plan=app.sustainability_plan,
        schools_targeted=app.schools_targeted,
        grade_coverage=app.grade_coverage,
        total_requested=app.total_requested,
        budget_personnel=app.budget_personnel,
        budget_equipment=app.budget_equipment,
        budget_travel=app.budget_travel,
        budget_overheads=app.budget_overheads,
        budget_other=app.budget_other,
        budget_justification=app.budget_justification,
        prior_projects=app.prior_projects,
        has_previous_grants=app.has_previous_grants,
        prior_funder=app.prior_funder,
        prior_amount=app.prior_amount,
        signatory_name=app.signatory_name,
        designation=app.designation,
        submission_date=app.submission_date,
        declared=app.declared,
        screening_status=app.screening_status,
        ai_review_package=app.ai_review_package,
        final_decision=app.final_decision,
        decision_reason=app.decision_reason,
        decision_by=app.decision_by,
        decision_at=app.decision_at,
        project_type=app.project_type,
        beneficiary_demographics=app.beneficiary_demographics,
        key_activities=app.key_activities,
        expected_outcomes=app.expected_outcomes,
        start_date=app.start_date,
        end_date=app.end_date,
        district=app.district,
        state=app.state,
    )


# ─── Legacy review/assign/approve/reject endpoints ───────────────────────────

@router.post("/reviews", response_model=schemas.ReviewResponse)
def submit_review_legacy(
    review_data: schemas.ReviewCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Submit a legacy-style review (for frontend compatibility)."""
    if current_user.role not in [models.RoleEnum.reviewer, models.RoleEnum.admin, models.RoleEnum.officer]:
        raise HTTPException(status_code=403, detail="Not authorised to submit reviews")

    new_review = models.Review(
        application_id=review_data.application_id,
        reviewer_id=current_user.id,
        score_alignment=review_data.score_alignment,
        score_feasibility=review_data.score_feasibility,
        score_impact=review_data.score_impact,
        score_budget=review_data.score_budget,
        score_track_record=review_data.score_track_record,
        total_score=(
            review_data.score_alignment + review_data.score_feasibility +
            review_data.score_impact + (review_data.score_budget or 0) +
            (review_data.score_track_record or 0)
        ),
        comments=review_data.comments,
        status="submitted",
    )
    db.add(new_review)

    app = db.query(models.Application).filter(
        models.Application.id == review_data.application_id
    ).first()
    if app:
        app.status = models.ApplicationStatusEnum.reviewed

    db.commit()
    db.refresh(new_review)
    return new_review


@router.post("/applications/{app_id}/assign")
def assign_application_legacy(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Legacy: assign application for review."""
    if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorised")
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = models.ApplicationStatusEnum.assigned
    db.commit()
    return {"message": "Application assigned for review"}


@router.post("/applications/{app_id}/approve")
def approve_application_legacy(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Legacy: approve application."""
    if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorised")
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = models.ApplicationStatusEnum.approved
    app.final_decision = "approved"
    db.commit()
    return {"message": "Application approved"}


@router.post("/applications/{app_id}/reject")
def reject_application_legacy(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Legacy: reject application."""
    if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorised")
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = models.ApplicationStatusEnum.rejected
    app.final_decision = "rejected"
    db.commit()
    return {"message": "Application rejected"}


# ─── My Applications (convenience) ───────────────────────────────────────────

@router.get("/my-applications", response_model=list[schemas.ApplicationResponse])
def my_applications(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """List applications for the current user."""
    if current_user.role == models.RoleEnum.applicant:
        apps = db.query(models.Application).filter(
            models.Application.applicant_id == current_user.id
        ).all()
    else:
        apps = db.query(models.Application).all()

    result = []
    for app in apps:
        result.append(schemas.ApplicationResponse(
            id=app.id,
            reference_id=app.reference_id,
            applicant_id=app.applicant_id,
            status=app.status,
            grant_type=app.grant_type,
            org_name=app.org_name or "",
            requested_amount=app.total_requested or 0.0,
            submitted_at=app.submitted_at,
            ai_score=app.ai_score or 0,
            ai_summary=app.ai_summary,
            screening_status=app.screening_status,
            final_decision=app.final_decision,
        ))
    return result
