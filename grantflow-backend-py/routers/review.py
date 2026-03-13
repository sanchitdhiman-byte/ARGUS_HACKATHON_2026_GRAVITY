"""
Module 4 - Expert Review
Reviewer assignment, AI review package, dimension scoring, and annotations.
"""
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import database, models, schemas, auth, ai_service
from helpers import create_notification, create_audit_log

router = APIRouter(tags=["review"])

# Rubric dimensions per grant type
RUBRIC = {
    "CDG": [
        {"name": "Community Need & Problem Clarity", "weight": 0.25},
        {"name": "Solution Design & Feasibility", "weight": 0.25},
        {"name": "Team & Organisational Capacity", "weight": 0.20},
        {"name": "Budget Reasonableness", "weight": 0.15},
        {"name": "Sustainability & Long-term Impact", "weight": 0.15},
    ],
    "EIG": [
        {"name": "Innovation & Differentiation", "weight": 0.25},
        {"name": "Evidence Base & Learning Design", "weight": 0.20},
        {"name": "Scale & Replication Potential", "weight": 0.20},
        {"name": "Team & Execution Capacity", "weight": 0.20},
        {"name": "Budget & Cost Effectiveness", "weight": 0.15},
    ],
    "ECAG": [
        {"name": "Environmental Impact & Urgency", "weight": 0.25},
        {"name": "Community Involvement", "weight": 0.25},
        {"name": "Technical Feasibility", "weight": 0.20},
        {"name": "Monitoring & Indicators", "weight": 0.15},
        {"name": "Budget Reasonableness", "weight": 0.15},
    ],
}

REQUIRED_REVIEWERS = {"CDG": 1, "EIG": 2, "ECAG": 1}


# ─── Assign Reviewer ─────────────────────────────────────────────────────────

@router.post("/applications/{app_id}/assign-reviewer", response_model=schemas.ReviewerAssignmentResponse)
def assign_reviewer(
    app_id: int,
    req: schemas.AssignReviewerRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Assign a reviewer to an application. PO/admin only."""
    if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Only Programme Officers can assign reviewers")

    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    reviewer = db.query(models.User).filter(models.User.id == req.reviewer_id).first()
    if not reviewer:
        raise HTTPException(status_code=404, detail="Reviewer not found")

    if reviewer.role not in [models.RoleEnum.reviewer, models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=400, detail="User is not a reviewer")

    # Check for Conflict of Interest — reviewer email domain != applicant email domain
    applicant = db.query(models.User).filter(models.User.id == app.applicant_id).first()
    if applicant:
        def email_domain(email):
            return email.split("@")[-1].lower() if email and "@" in email else ""

        reviewer_domain = email_domain(reviewer.email)
        applicant_domain = email_domain(applicant.email)
        if reviewer_domain and applicant_domain and reviewer_domain == applicant_domain:
            raise HTTPException(
                status_code=400,
                detail=f"Conflict of interest: reviewer and applicant share the same email domain ({reviewer_domain})"
            )

    # Check if already assigned
    existing = db.query(models.ReviewerAssignment).filter(
        models.ReviewerAssignment.application_id == app_id,
        models.ReviewerAssignment.reviewer_id == req.reviewer_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Reviewer already assigned to this application")

    assignment = models.ReviewerAssignment(
        application_id=app_id,
        reviewer_id=req.reviewer_id,
        assigned_by=current_user.id,
        status="assigned"
    )
    db.add(assignment)

    # Create Review record for this reviewer
    rubric_dims = RUBRIC.get(app.grant_type, RUBRIC["CDG"])
    review = models.Review(
        application_id=app_id,
        reviewer_id=req.reviewer_id,
        comments="",
        status="in_progress"
    )
    db.add(review)
    db.flush()  # get review.id

    # Create ReviewDimension placeholders
    for dim in rubric_dims:
        rd = models.ReviewDimension(
            review_id=review.id,
            dimension_name=dim["name"],
            weight=dim["weight"]
        )
        db.add(rd)

    # Update application status
    app.status = models.ApplicationStatusEnum.under_review

    # Notify reviewer
    create_notification(
        db, req.reviewer_id, "review_assigned",
        f"New Application to Review: {app.reference_id}",
        f"You have been assigned to review application {app.reference_id} ({app.grant_type}). Please log in to the Reviewer Workspace.",
        application_id=app_id
    )

    create_audit_log(
        db, current_user.id, current_user.email,
        "reviewer.assigned", "application", app_id,
        detail={"reviewer_id": req.reviewer_id, "reviewer_email": reviewer.email}
    )

    db.commit()
    db.refresh(assignment)
    return assignment


# ─── Review Package ──────────────────────────────────────────────────────────

@router.get("/applications/{app_id}/review-package")
def get_review_package(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get the AI review package for an application.
    Generates and stores if not yet created.
    """
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Check access
    if current_user.role == models.RoleEnum.applicant:
        raise HTTPException(status_code=403, detail="Applicants cannot access review packages")

    # Return cached if exists
    if app.ai_review_package:
        try:
            return json.loads(app.ai_review_package)
        except json.JSONDecodeError:
            pass

    # Generate new package
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
        "budget_personnel": app.budget_personnel,
        "budget_equipment": app.budget_equipment,
        "budget_travel": app.budget_travel,
        "budget_overheads": app.budget_overheads,
        "budget_other": app.budget_other,
        "sustainability_plan": app.sustainability_plan,
        "prior_projects": app.prior_projects,
        "start_date": app.start_date,
        "end_date": app.end_date,
        "primary_learning_outcome": app.primary_learning_outcome,
        "measurement_plan": app.measurement_plan,
        "environmental_problem": app.environmental_problem,
        "community_involvement_plan": app.community_involvement_plan,
    }

    package = ai_service.generate_review_package(app_data, app.grant_type)

    # Inject AI scores into existing ReviewDimension records
    reviews = db.query(models.Review).filter(
        models.Review.application_id == app_id
    ).all()
    for review in reviews:
        dims = db.query(models.ReviewDimension).filter(
            models.ReviewDimension.review_id == review.id
        ).all()
        dim_map = {d["name"]: d for d in package.get("dimension_scores", [])}
        for dim in dims:
            matched = dim_map.get(dim.dimension_name)
            if matched:
                dim.ai_suggested_score = matched.get("score")
                dim.ai_justification = matched.get("justification")
                dim.ai_section_reference = matched.get("section_ref")
        review.ai_package_generated = True

    # Cache in application
    app.ai_review_package = json.dumps(package)

    create_audit_log(
        db, current_user.id, current_user.email,
        "review_package.generated", "application", app_id
    )

    db.commit()
    return package


# ─── Assignments & Reviews ───────────────────────────────────────────────────

@router.get("/applications/{app_id}/assignments", response_model=list[schemas.ReviewerAssignmentResponse])
def get_assignments(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """List all reviewer assignments for an application."""
    if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin, models.RoleEnum.reviewer]:
        raise HTTPException(status_code=403, detail="Not authorised")
    return db.query(models.ReviewerAssignment).filter(
        models.ReviewerAssignment.application_id == app_id
    ).all()


@router.get("/my-reviews")
def my_reviews(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """List applications assigned to the current reviewer."""
    assignments = db.query(models.ReviewerAssignment).filter(
        models.ReviewerAssignment.reviewer_id == current_user.id
    ).all()

    result = []
    for a in assignments:
        app = db.query(models.Application).filter(models.Application.id == a.application_id).first()
        review = db.query(models.Review).filter(
            models.Review.application_id == a.application_id,
            models.Review.reviewer_id == current_user.id
        ).first()
        if app:
            result.append({
                "assignment_id": a.id,
                "assignment_status": a.status,
                "assigned_at": a.assigned_at,
                "application_id": app.id,
                "reference_id": app.reference_id,
                "grant_type": app.grant_type,
                "org_name": app.org_name,
                "project_title": app.project_title,
                "total_requested": app.total_requested,
                "review_id": review.id if review else None,
                "review_status": review.status if review else None,
                "total_score": review.total_score if review else None,
            })
    return result


@router.get("/reviews/{review_id}")
def get_review(
    review_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get a review with its dimensions."""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Access check
    if current_user.role == models.RoleEnum.reviewer and review.reviewer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised to view this review")

    dims = db.query(models.ReviewDimension).filter(
        models.ReviewDimension.review_id == review_id
    ).all()

    return {
        "id": review.id,
        "application_id": review.application_id,
        "reviewer_id": review.reviewer_id,
        "status": review.status,
        "total_score": review.total_score,
        "comments": review.comments,
        "created_at": review.created_at,
        "submitted_at": review.submitted_at,
        "ai_package_generated": review.ai_package_generated,
        "dimensions": [
            {
                "id": d.id,
                "dimension_name": d.dimension_name,
                "weight": d.weight,
                "ai_suggested_score": d.ai_suggested_score,
                "ai_justification": d.ai_justification,
                "ai_section_reference": d.ai_section_reference,
                "human_score": d.human_score,
                "override_comment": d.override_comment,
                "is_confirmed": d.is_confirmed,
            }
            for d in dims
        ]
    }


@router.put("/reviews/{review_id}/dimensions")
def update_dimensions(
    review_id: int,
    updates: List[schemas.ReviewDimensionUpdate],
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Update dimension scores for a review (auto-save)."""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if current_user.role not in [models.RoleEnum.reviewer, models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorised")
    if current_user.role == models.RoleEnum.reviewer and review.reviewer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised to update this review")

    if review.status == "submitted":
        raise HTTPException(status_code=400, detail="Review already submitted")

    for update in updates:
        dim = db.query(models.ReviewDimension).filter(
            models.ReviewDimension.review_id == review_id,
            models.ReviewDimension.dimension_name == update.dimension_name
        ).first()
        if dim:
            dim.human_score = update.human_score
            if update.override_comment:
                dim.override_comment = update.override_comment
            dim.is_confirmed = True

    # Update assignment status to in_progress
    assignment = db.query(models.ReviewerAssignment).filter(
        models.ReviewerAssignment.application_id == review.application_id,
        models.ReviewerAssignment.reviewer_id == current_user.id
    ).first()
    if assignment and assignment.status == "assigned":
        assignment.status = "in_progress"

    db.commit()
    return {"message": "Dimensions updated"}


@router.post("/reviews/{review_id}/submit")
def submit_review(
    review_id: int,
    comments: dict = {},
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Submit a review — calculates weighted total and checks if all reviewers are done."""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if current_user.role == models.RoleEnum.reviewer and review.reviewer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")

    if review.status == "submitted":
        raise HTTPException(status_code=400, detail="Review already submitted")

    # Calculate weighted total score
    dims = db.query(models.ReviewDimension).filter(
        models.ReviewDimension.review_id == review_id
    ).all()

    weighted_total = 0.0
    for d in dims:
        score = d.human_score or d.ai_suggested_score or 0
        weighted_total += score * d.weight

    # Scale to 100
    total_score = round(weighted_total * 20)  # 5 * weight_sum * 20 = 100

    review.status = "submitted"
    review.submitted_at = datetime.utcnow()
    review.total_score = total_score
    if isinstance(comments, dict):
        review.comments = comments.get("comments", review.comments or "")

    # Update assignment
    assignment = db.query(models.ReviewerAssignment).filter(
        models.ReviewerAssignment.application_id == review.application_id,
        models.ReviewerAssignment.reviewer_id == current_user.id
    ).first()
    if assignment:
        assignment.status = "complete"

    # Check if all required reviewers have submitted
    app = db.query(models.Application).filter(models.Application.id == review.application_id).first()
    if app:
        required = REQUIRED_REVIEWERS.get(app.grant_type, 1)
        all_assignments = db.query(models.ReviewerAssignment).filter(
            models.ReviewerAssignment.application_id == app.id
        ).all()
        complete_count = sum(1 for a in all_assignments if a.status == "complete")

        if complete_count >= required:
            app.status = models.ApplicationStatusEnum.reviewed

    create_audit_log(
        db, current_user.id, current_user.email,
        "review.submitted", "review", review_id,
        detail={"total_score": total_score, "application_id": review.application_id}
    )

    db.commit()
    return {"message": "Review submitted", "total_score": total_score}


# ─── Annotations ─────────────────────────────────────────────────────────────

@router.post("/applications/{app_id}/annotations", response_model=schemas.AnnotationResponse)
def create_annotation(
    app_id: int,
    req: schemas.AnnotationCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Add a text annotation to an application."""
    if current_user.role not in [models.RoleEnum.reviewer, models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorised to annotate")

    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    annotation = models.TextAnnotation(
        application_id=app_id,
        reviewer_id=current_user.id,
        selected_text=req.selected_text,
        note=req.note,
        section_name=req.section_name
    )
    db.add(annotation)
    db.commit()
    db.refresh(annotation)
    return annotation


@router.get("/applications/{app_id}/annotations", response_model=list[schemas.AnnotationResponse])
def get_annotations(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get all annotations for an application."""
    if current_user.role == models.RoleEnum.applicant:
        raise HTTPException(status_code=403, detail="Applicants cannot view annotations")
    return db.query(models.TextAnnotation).filter(
        models.TextAnnotation.application_id == app_id
    ).all()


# ─── Review Queue ────────────────────────────────────────────────────────────

@router.get("/review-queue")
def review_queue(
    status: str = None,
    grant_type: str = None,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    PO view: all reviewed applications with scores.
    Filterable by status and grant type.
    """
    if current_user.role not in [models.RoleEnum.officer, models.RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorised")

    query = db.query(models.Application).filter(
        models.Application.status.in_([
            models.ApplicationStatusEnum.reviewed,
            models.ApplicationStatusEnum.risk_flagged,
            models.ApplicationStatusEnum.pending_review
        ])
    )

    if status:
        try:
            query = query.filter(models.Application.status == models.ApplicationStatusEnum(status))
        except ValueError:
            pass

    if grant_type:
        query = query.filter(models.Application.grant_type == grant_type.upper())

    apps = query.all()
    result = []
    for app in apps:
        reviews = db.query(models.Review).filter(
            models.Review.application_id == app.id,
            models.Review.status == "submitted"
        ).all()
        avg_score = sum(r.total_score or 0 for r in reviews) / len(reviews) if reviews else None
        result.append({
            "application_id": app.id,
            "reference_id": app.reference_id,
            "grant_type": app.grant_type,
            "org_name": app.org_name,
            "project_title": app.project_title,
            "total_requested": app.total_requested,
            "status": app.status,
            "screening_status": app.screening_status,
            "reviewer_count": len(reviews),
            "average_score": round(avg_score, 1) if avg_score else None,
            "submitted_at": app.submitted_at,
        })

    result.sort(key=lambda x: (x["average_score"] or 0), reverse=True)
    return result
