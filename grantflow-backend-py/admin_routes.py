from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

import database, models, schemas, auth

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != models.RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


def log_action(db: Session, actor: models.User, action: str, object_type: str, object_id: str = None, details: str = None):
    entry = models.AuditLog(
        actor_id=actor.id,
        actor_email=actor.email,
        action=action,
        object_type=object_type,
        object_id=object_id,
        details=details,
        timestamp=datetime.utcnow()
    )
    db.add(entry)
    db.commit()


# --- User Management ---

@router.get("/users", response_model=list[schemas.UserAdminResponse])
def list_users(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    return db.query(models.User).all()


@router.post("/users", response_model=schemas.UserAdminResponse)
def create_staff(
    req: schemas.CreateStaffRequest,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    if req.role == models.RoleEnum.applicant:
        raise HTTPException(status_code=400, detail="Use self-registration for applicant accounts")
    existing = db.query(models.User).filter(models.User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        org_name=req.org_name,
        email=req.email,
        hashed_password=auth.get_password_hash(req.password),
        role=req.role,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    log_action(db, admin, "STAFF_CREATED", "User", str(new_user.id),
               f"Created {req.role} account for {req.email}")
    return new_user


@router.patch("/users/{user_id}/role", response_model=schemas.UserAdminResponse)
def update_role(
    user_id: int,
    req: schemas.UpdateRoleRequest,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    old_role = user.role
    user.role = req.role
    db.commit()
    db.refresh(user)
    log_action(db, admin, "ROLE_CHANGED", "User", str(user_id),
               f"Changed role from {old_role} to {req.role} for {user.email}")
    return user


@router.patch("/users/{user_id}/deactivate")
def deactivate_user(
    user_id: int,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate your own account")
    user.is_active = False
    db.commit()
    log_action(db, admin, "USER_DEACTIVATED", "User", str(user_id),
               f"Deactivated account for {user.email}")
    return {"message": "User deactivated"}


@router.patch("/users/{user_id}/activate")
def activate_user(
    user_id: int,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = True
    db.commit()
    log_action(db, admin, "USER_ACTIVATED", "User", str(user_id),
               f"Activated account for {user.email}")
    return {"message": "User activated"}


# --- Platform Stats ---

@router.get("/stats")
def get_stats(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    App = models.Application
    Status = models.ApplicationStatusEnum

    total_apps = db.query(func.count(App.id)).scalar() or 0
    approved   = db.query(func.count(App.id)).filter(App.status == Status.approved).scalar() or 0
    rejected   = db.query(func.count(App.id)).filter(App.status == Status.rejected).scalar() or 0
    risk_flagged = db.query(func.count(App.id)).filter(App.status == Status.risk_flagged).scalar() or 0
    pending    = db.query(func.count(App.id)).filter(App.status.in_([
        Status.pending_review, Status.assigned, Status.under_review, Status.reviewed
    ])).scalar() or 0

    total_requested      = db.query(func.sum(App.total_requested)).scalar() or 0
    total_approved_amount = db.query(func.sum(App.total_requested)).filter(
        App.status == Status.approved
    ).scalar() or 0

    total_users  = db.query(func.count(models.User.id)).scalar() or 0
    active_users = db.query(func.count(models.User.id)).filter(models.User.is_active == True).scalar() or 0

    by_grant_type = {}
    for gt in ["CDG", "EIG", "ECAG"]:
        by_grant_type[gt] = db.query(func.count(App.id)).filter(App.grant_type == gt).scalar() or 0

    by_status = {}
    for s in Status:
        by_status[s.value] = db.query(func.count(App.id)).filter(App.status == s).scalar() or 0

    return {
        "applications": {
            "total": total_apps,
            "approved": approved,
            "rejected": rejected,
            "pending": pending,
            "risk_flagged": risk_flagged,
        },
        "financials": {
            "total_requested": total_requested,
            "total_approved": total_approved_amount,
        },
        "users": {
            "total": total_users,
            "active": active_users,
        },
        "by_grant_type": by_grant_type,
        "by_status": by_status,
    }


# --- Grant Programme Management ---

@router.get("/grants", response_model=list[schemas.GrantProgramResponse])
def list_grants(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    return db.query(models.GrantProgram).all()


@router.post("/grants", response_model=schemas.GrantProgramResponse)
def create_grant_program(
    grant_data: schemas.GrantProgramCreate,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    existing = db.query(models.GrantProgram).filter(models.GrantProgram.code == grant_data.code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Grant programme '{grant_data.code}' already exists")
    new_grant = models.GrantProgram(**grant_data.model_dump())
    db.add(new_grant)
    db.commit()
    db.refresh(new_grant)
    log_action(db, admin, "GRANT_CREATED", "GrantProgram", str(new_grant.id),
               f"Created grant programme {new_grant.code}: {new_grant.title}")
    return new_grant


@router.patch("/grants/{grant_id}/toggle")
def toggle_grant_program(
    grant_id: int,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    grant = db.query(models.GrantProgram).filter(models.GrantProgram.id == grant_id).first()
    if not grant:
        raise HTTPException(status_code=404, detail="Grant programme not found")
    grant.is_active = not grant.is_active
    db.commit()
    log_action(db, admin, "GRANT_TOGGLED", "GrantProgram", str(grant_id),
               f"{'Activated' if grant.is_active else 'Deactivated'} grant {grant.code}")
    return {"message": f"Grant {grant.code} {'activated' if grant.is_active else 'deactivated'}", "is_active": grant.is_active}


# --- Audit Log ---

@router.get("/audit-log", response_model=list[schemas.AuditLogResponse])
def get_audit_log(
    limit: int = 200,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(database.get_db)
):
    return (
        db.query(models.AuditLog)
        .order_by(models.AuditLog.timestamp.desc())
        .limit(limit)
        .all()
    )
