"""
Module 8 - Administration
User management, audit logs, and platform analytics.
"""
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

import database, models, schemas, auth
from helpers import create_audit_log

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != models.RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# ─── User Management ─────────────────────────────────────────────────────────

@router.get("/users", response_model=list[schemas.UserResponse])
def list_users(
    current_user: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    """List all users."""
    return db.query(models.User).all()


@router.post("/users", response_model=schemas.UserResponse)
def create_staff_account(
    req: schemas.CreateStaffRequest,
    current_user: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    """Create a staff account (reviewer, officer, or finance)."""
    valid_roles = ["reviewer", "officer", "finance", "admin"]
    if req.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Role must be one of: {valid_roles}")

    existing = db.query(models.User).filter(models.User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        role_enum = models.RoleEnum(req.role)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid role: {req.role}")

    hashed_pwd = auth.get_password_hash(req.password)
    user = models.User(
        full_name=req.full_name,
        email=req.email,
        org_name=req.full_name,  # Use full_name as org_name for staff
        hashed_password=hashed_pwd,
        role=role_enum,
        is_active=True
    )
    db.add(user)

    create_audit_log(
        db, current_user.id, current_user.email,
        "user.created", "user",
        detail={"email": req.email, "role": req.role}
    )

    db.commit()
    db.refresh(user)
    return user


@router.patch("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: int,
    req: schemas.UpdateUserRequest,
    current_user: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    """Update a user account (deactivate, change role)."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    changes = {}
    if req.is_active is not None:
        user.is_active = req.is_active
        changes["is_active"] = req.is_active

    if req.role is not None:
        try:
            user.role = models.RoleEnum(req.role)
            changes["role"] = req.role
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid role: {req.role}")

    create_audit_log(
        db, current_user.id, current_user.email,
        "user.updated", "user", user_id,
        detail=changes
    )

    db.commit()
    db.refresh(user)
    return user


# ─── Audit Log ───────────────────────────────────────────────────────────────

@router.get("/audit-log")
def get_audit_log(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=500),
    actor_id: Optional[int] = None,
    action: Optional[str] = None,
    object_type: Optional[str] = None,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    current_user: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    """Paginated audit log with filters."""
    query = db.query(models.AuditLog)

    if actor_id:
        query = query.filter(models.AuditLog.actor_id == actor_id)
    if action:
        query = query.filter(models.AuditLog.action.ilike(f"%{action}%"))
    if object_type:
        query = query.filter(models.AuditLog.object_type == object_type)
    if from_date:
        try:
            from_dt = datetime.fromisoformat(from_date)
            query = query.filter(models.AuditLog.timestamp >= from_dt)
        except ValueError:
            pass
    if to_date:
        try:
            to_dt = datetime.fromisoformat(to_date)
            query = query.filter(models.AuditLog.timestamp <= to_dt)
        except ValueError:
            pass

    total = query.count()
    logs = query.order_by(models.AuditLog.timestamp.desc()).offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
        "items": [
            {
                "id": l.id,
                "actor_id": l.actor_id,
                "actor_email": l.actor_email,
                "action": l.action,
                "object_type": l.object_type,
                "object_id": l.object_id,
                "detail": json.loads(l.detail) if l.detail else None,
                "timestamp": l.timestamp,
            }
            for l in logs
        ]
    }


# ─── Analytics ───────────────────────────────────────────────────────────────

@router.get("/analytics")
def get_analytics(
    current_user: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    """Platform-wide analytics."""
    # Applications by status
    status_counts = (
        db.query(models.Application.status, func.count(models.Application.id))
        .group_by(models.Application.status)
        .all()
    )
    by_status = {str(s): c for s, c in status_counts}

    # Applications by grant type
    type_counts = (
        db.query(models.Application.grant_type, func.count(models.Application.id))
        .group_by(models.Application.grant_type)
        .all()
    )
    by_grant_type = {t: c for t, c in type_counts}

    # Total amounts
    total_requested = db.query(func.sum(models.Application.total_requested)).scalar() or 0
    approved_amount = (
        db.query(func.sum(models.Application.total_requested))
        .filter(models.Application.final_decision == "approved")
        .scalar() or 0
    )
    disbursed_amount = (
        db.query(func.sum(models.DisbursementTranche.amount))
        .filter(models.DisbursementTranche.status == "disbursed")
        .scalar() or 0
    )

    # Active grants
    active_count = (
        db.query(func.count(models.Application.id))
        .filter(models.Application.status.in_([
            models.ApplicationStatusEnum.active,
            models.ApplicationStatusEnum.active_reporting
        ]))
        .scalar() or 0
    )

    # Users by role
    role_counts = (
        db.query(models.User.role, func.count(models.User.id))
        .group_by(models.User.role)
        .all()
    )
    by_role = {str(r): c for r, c in role_counts}

    # Reports
    total_reports = db.query(func.count(models.Report.id)).scalar() or 0
    pending_reports = (
        db.query(func.count(models.Report.id))
        .filter(models.Report.status.in_(["submitted", "under_review"]))
        .scalar() or 0
    )

    # Screening funnel
    screening_pass = (
        db.query(func.count(models.Application.id))
        .filter(models.Application.screening_status == "pass")
        .scalar() or 0
    )
    screening_fail = (
        db.query(func.count(models.Application.id))
        .filter(models.Application.screening_status == "fail")
        .scalar() or 0
    )

    total_apps = db.query(func.count(models.Application.id)).scalar() or 0
    total_users = db.query(func.count(models.User.id)).scalar() or 0

    return {
        "summary": {
            "total_applications": total_apps,
            "total_users": total_users,
            "active_grants": active_count,
            "total_amount_requested": total_requested,
            "total_amount_approved": approved_amount,
            "total_disbursed": disbursed_amount,
            "total_reports": total_reports,
            "pending_report_reviews": pending_reports,
        },
        "applications_by_status": by_status,
        "applications_by_grant_type": by_grant_type,
        "users_by_role": by_role,
        "screening_funnel": {
            "screened_pass": screening_pass,
            "screened_fail": screening_fail,
            "pending_screening": total_apps - screening_pass - screening_fail,
        }
    }
