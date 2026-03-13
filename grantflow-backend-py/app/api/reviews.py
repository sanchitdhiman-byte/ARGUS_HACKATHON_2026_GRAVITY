"""Reviewer assignment, AI review packages, and review submission."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import (
    Application, Review, User, RoleEnum, ApplicationStatusEnum, AuditLog,
)
from app.schemas.schemas import ReviewCreate, ReviewResponse, ReviewerAssignment
from app.core.security import get_current_user
from app.core.constants import GRANT_PROGRAMMES
from app.services.notification import notify_review_assigned

router = APIRouter(tags=["Reviews"])


@router.post("/applications/{app_id}/assign-reviewer")
def assign_reviewer(
    app_id: int,
    assignment: ReviewerAssignment,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Assign a reviewer to an application. Officers/Admins only."""
    if current_user.role not in [RoleEnum.officer, RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorized")

    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    reviewer = db.query(User).filter(User.id == assignment.reviewer_id, User.role == RoleEnum.reviewer).first()
    if not reviewer:
        raise HTTPException(status_code=404, detail="Reviewer not found")

    # Conflict of interest check: reviewer email domain != applicant email domain
    applicant = db.query(User).filter(User.id == app.applicant_id).first()
    if applicant:
        applicant_domain = (applicant.email or "").split("@")[-1].lower()
        reviewer_domain = (reviewer.email or "").split("@")[-1].lower()
        if applicant_domain and applicant_domain == reviewer_domain:
            raise HTTPException(status_code=400, detail="Conflict of interest: reviewer shares email domain with applicant")

    # Check reviewer limit per grant type
    programme = GRANT_PROGRAMMES.get(app.grant_type, {})
    max_reviewers = programme.get("reviewers_required", 1)
    existing_reviews = db.query(Review).filter(Review.application_id == app_id).count()
    if existing_reviews >= max_reviewers:
        raise HTTPException(status_code=400, detail=f"Maximum {max_reviewers} reviewer(s) already assigned")

    # Create review record
    review = Review(
        application_id=app_id,
        reviewer_id=assignment.reviewer_id,
        status="in_progress",
    )
    db.add(review)

    app.status = ApplicationStatusEnum.assigned
    db.add(AuditLog(actor_id=current_user.id, action="assign_reviewer", object_type="application", object_id=app_id,
                     details={"reviewer_id": assignment.reviewer_id}))
    db.commit()

    notify_review_assigned(db, assignment.reviewer_id, app.reference_id)

    return {"message": f"Reviewer {reviewer.org_name} assigned to application {app.reference_id}"}


@router.get("/applications/{app_id}/review-package")
def get_review_package(
    app_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the AI-generated review package for an application."""
    if current_user.role not in [RoleEnum.reviewer, RoleEnum.officer, RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorized")

    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    return {
        "application_id": app_id,
        "reference_id": app.reference_id,
        "screening_report": app.screening_report,
        "ai_review_package": app.ai_review_package,
        "ai_scores": {
            "alignment": app.ai_score_alignment,
            "feasibility": app.ai_score_feasibility,
            "impact": app.ai_score_impact,
            "composite": app.ai_score,
        },
    }


@router.post("/reviews", response_model=ReviewResponse)
def submit_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit or update a review. Reviewers/Officers/Admins only."""
    if current_user.role not in [RoleEnum.reviewer, RoleEnum.admin, RoleEnum.officer]:
        raise HTTPException(status_code=403, detail="Not authorized to submit reviews")

    # Check if reviewer has an existing in-progress review for this app
    existing = db.query(Review).filter(
        Review.application_id == review_data.application_id,
        Review.reviewer_id == current_user.id,
        Review.status == "in_progress",
    ).first()

    if existing:
        # Update existing review
        existing.score_alignment = review_data.score_alignment
        existing.score_feasibility = review_data.score_feasibility
        existing.score_impact = review_data.score_impact
        existing.score_budget = review_data.score_budget
        existing.score_track_record = review_data.score_track_record
        existing.total_score = (
            review_data.score_alignment + review_data.score_feasibility +
            review_data.score_impact + (review_data.score_budget or 0) +
            (review_data.score_track_record or 0)
        )
        existing.comments = review_data.comments
        existing.ai_overrides = review_data.ai_overrides
        existing.status = "submitted"
        existing.submitted_at = datetime.utcnow()
        review = existing
    else:
        review = Review(
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
            ai_overrides=review_data.ai_overrides,
            status="submitted",
            submitted_at=datetime.utcnow(),
        )
        db.add(review)

    # Update application status
    app = db.query(Application).filter(Application.id == review_data.application_id).first()
    if app:
        programme = GRANT_PROGRAMMES.get(app.grant_type, {})
        required = programme.get("reviewers_required", 1)
        submitted_count = db.query(Review).filter(
            Review.application_id == review_data.application_id,
            Review.status == "submitted",
        ).count()
        # Count the current one being submitted
        if existing:
            pass  # already counted
        else:
            submitted_count += 1

        if submitted_count >= required:
            app.status = ApplicationStatusEnum.reviewed
        else:
            app.status = ApplicationStatusEnum.under_review

    db.add(AuditLog(actor_id=current_user.id, action="submit_review", object_type="review",
                     object_id=review_data.application_id))
    db.commit()
    db.refresh(review)
    return review


@router.get("/reviews", response_model=list[ReviewResponse])
def get_reviews(
    application_id: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get reviews. Reviewers see their own; staff see all."""
    query = db.query(Review)

    if application_id:
        query = query.filter(Review.application_id == application_id)

    if current_user.role == RoleEnum.reviewer:
        query = query.filter(Review.reviewer_id == current_user.id)

    return query.order_by(Review.created_at.desc()).all()


@router.get("/reviewers", response_model=list[dict])
def list_reviewers(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """List available reviewers. Officers/Admins only."""
    if current_user.role not in [RoleEnum.officer, RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorized")

    reviewers = db.query(User).filter(User.role == RoleEnum.reviewer, User.is_active == True).all()
    return [{"id": r.id, "org_name": r.org_name, "email": r.email} for r in reviewers]
