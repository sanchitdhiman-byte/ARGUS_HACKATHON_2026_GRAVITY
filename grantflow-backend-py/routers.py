from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, models, schemas
import time

router = APIRouter()

@router.post("/applications", response_model=schemas.ApplicationResponse)
def create_application(app_data: schemas.ApplicationCreate, user_id: int = 1, db: Session = Depends(database.get_db)):
    ref_id = f"APP-2026-{int(time.time() * 1000) % 10000}X"
    
    # Mock AI Screening Logic on creation
    summary = f"Applicant proposes to solve {app_data.problem_stmt[:20]}... with {app_data.solution[:20]}..."
    flag =  models.ApplicationStatusEnum.risk_flagged if app_data.requested_amount > 2000000 else models.ApplicationStatusEnum.under_review
    
    new_app = models.Application(
        reference_id=ref_id,
        applicant_id=user_id,
        programme=app_data.programme,
        title=app_data.title,
        duration_months=app_data.duration_months,
        state_region=app_data.state_region,
        problem_stmt=app_data.problem_stmt,
        solution=app_data.solution,
        requested_amount=app_data.requested_amount,
        beneficiary_count=app_data.beneficiary_count,
        status=flag,
        ai_score_alignment=4,
        ai_score_feasibility=3,
        ai_summary=summary
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@router.get("/applications", response_model=list[schemas.ApplicationResponse])
def get_applications(db: Session = Depends(database.get_db)):
    return db.query(models.Application).all()

@router.get("/applications/{app_id}", response_model=schemas.ApplicationResponse)
def get_application(app_id: int, db: Session = Depends(database.get_db)):
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
         raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.post("/reviews", response_model=schemas.ReviewResponse)
def submit_review(review_data: schemas.ReviewCreate, db: Session = Depends(database.get_db)):
    # Create Review
    new_review = models.Review(
        application_id=review_data.application_id,
        reviewer_id=2, # Mock Reviewer ID
        score_alignment=review_data.score_alignment,
        score_feasibility=review_data.score_feasibility,
        score_impact=review_data.score_impact,
        comments=review_data.comments
    )
    db.add(new_review)
    
    # Update app status
    app = db.query(models.Application).filter(models.Application.id == review_data.application_id).first()
    if app:
        app.status = models.ApplicationStatusEnum.approved
        
    db.commit()
    db.refresh(new_review)
    return new_review
