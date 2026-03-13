from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, models, schemas, auth
import time
import json

router = APIRouter()

@router.post("/applications", response_model=schemas.ApplicationResponse)
def create_application(app_comp: schemas.ApplicationCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    ref_id = f"APP-{app_comp.grantType}-2026-{int(time.time() * 1000) % 10000}X"
    
    fd = app_comp.formData
    
    # basic conversion wrapper to ensure we don't fail null floats
    def parse_float(val):
        try:
            return float(val) if val else 0.0
        except:
            return 0.0

    def parse_int(val):
        try:
            return int(val) if val else 0
        except:
            return 0

    req_amt = parse_float(fd.get("totalRequested"))

    # Mock AI Screening Logic on creation based on business rules
    summary = f"Applicant {fd.get('orgName', 'Unknown')} proposes: {str(fd.get('problemStatement', ''))[:50]}... with budget ₹{req_amt}"
    
    # if EIG, budget > 15L is flagged context
    flag = models.ApplicationStatusEnum.screening
    if req_amt > 2000000:
         flag = models.ApplicationStatusEnum.risk_flagged
    else:
         flag = models.ApplicationStatusEnum.pending_review

    # Calculate AI Score mock
    base_score = 75
    if len(str(fd.get("problemStatement", ""))) > 100: base_score += 10
    if len(str(fd.get("proposedSolution", ""))) > 100: base_score += 10
    if float(req_amt) == 0: base_score -= 30

    new_app = models.Application(
        reference_id=ref_id,
        applicant_id=current_user.id,
        grant_type=app_comp.grantType,
        
        # Org
        org_name=fd.get("orgName"),
        reg_number=fd.get("regNumber"),
        entity_type=fd.get("entityType"),
        established_year=parse_int(fd.get("establishedYear")),
        org_budget=parse_float(fd.get("budget")),
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
        target_beneficiaries=parse_int(fd.get("targetBeneficiaries")),
        problem_statement=fd.get("problemStatement"),
        proposed_solution=fd.get("proposedSolution"),
        sustainability_plan=fd.get("sustainabilityPlan"),
        schools_targeted=parse_int(fd.get("schoolsTargeted")),
        grade_coverage=fd.get("gradeCoverage"),

        # Budget
        total_requested=req_amt,
        budget_personnel=parse_float(fd.get("personnel")),
        budget_equipment=parse_float(fd.get("equipment")),
        budget_travel=parse_float(fd.get("travel")),
        budget_overheads=parse_float(fd.get("overheads")),
        budget_other=parse_float(fd.get("other")),
        budget_justification=fd.get("justification"),

        # Experience
        prior_projects=json.dumps(fd.get("priorProjects", [])),
        has_previous_grants=bool(fd.get("hasPreviousGrants")),
        prior_funder=fd.get("priorFunder"),
        prior_amount=parse_float(fd.get("priorAmount")),
        signatory_name=fd.get("signatoryName"),
        designation=fd.get("designation"),
        submission_date=fd.get("submissionDate"),
        declared=bool(fd.get("declared")),

        status=flag,
        ai_score=min(100, max(0, base_score)),
        ai_summary=summary
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@router.get("/applications", response_model=list[schemas.ApplicationResponse])
def get_applications(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    if current_user.role == models.RoleEnum.applicant:
         return db.query(models.Application).filter(models.Application.applicant_id == current_user.id).all()
    # Program officer / Reviewer / Admin see all
    return db.query(models.Application).all()

@router.get("/applications/{app_id}", response_model=schemas.ApplicationDetailResponse)
def get_application(app_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
         raise HTTPException(status_code=404, detail="Application not found")
    
    if current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
         raise HTTPException(status_code=403, detail="Not authorized to view this application")

    return app

@router.post("/reviews", response_model=schemas.ReviewResponse)
def submit_review(review_data: schemas.ReviewCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    if current_user.role not in [models.RoleEnum.reviewer, models.RoleEnum.admin, models.RoleEnum.officer]:
         raise HTTPException(status_code=403, detail="Not authorized to submit reviews")

    # Create Review
    new_review = models.Review(
        application_id=review_data.application_id,
        reviewer_id=current_user.id,
        score_alignment=review_data.score_alignment,
        score_feasibility=review_data.score_feasibility,
        score_impact=review_data.score_impact,
        score_budget=review_data.score_budget,
        score_track_record=review_data.score_track_record,
        
        total_score=(review_data.score_alignment + review_data.score_feasibility + 
                     review_data.score_impact + (review_data.score_budget or 0) + 
                     (review_data.score_track_record or 0)),
        comments=review_data.comments
    )
    db.add(new_review)
    
    # Update app status
    app = db.query(models.Application).filter(models.Application.id == review_data.application_id).first()
    if app:
        app.status = models.ApplicationStatusEnum.reviewed
        
    db.commit()
    db.refresh(new_review)
    return new_review

@router.post("/applications/{app_id}/assign")
def assign_application(app_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
     if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
          raise HTTPException(status_code=403, detail="Not authorized")
     app = db.query(models.Application).filter(models.Application.id == app_id).first()
     if not app:
          raise HTTPException(status_code=404, detail="Application not found")
     
     app.status = models.ApplicationStatusEnum.assigned
     db.commit()
     return {"message": "Application assigned for review"}

@router.post("/applications/{app_id}/approve")
def approve_application(app_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
     if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
          raise HTTPException(status_code=403, detail="Not authorized")
     app = db.query(models.Application).filter(models.Application.id == app_id).first()
     if not app:
          raise HTTPException(status_code=404, detail="Application not found")
     
     app.status = models.ApplicationStatusEnum.approved
     db.commit()
     return {"message": "Application approved"}

@router.post("/applications/{app_id}/reject")
def reject_application(app_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
     if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
          raise HTTPException(status_code=403, detail="Not authorized")
     app = db.query(models.Application).filter(models.Application.id == app_id).first()
     if not app:
          raise HTTPException(status_code=404, detail="Application not found")
     
     app.status = models.ApplicationStatusEnum.rejected
     db.commit()
     return {"message": "Application rejected"}
