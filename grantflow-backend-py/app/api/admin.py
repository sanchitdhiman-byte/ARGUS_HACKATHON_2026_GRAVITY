"""Admin endpoints: stats, user management, grant programmes, audit log, workflow."""

import json
from typing import Optional
from pydantic import BaseModel, EmailStr

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.models.models import (
    User, Application, AuditLog, Disbursement, GrantProgramme,
    RoleEnum, ApplicationStatusEnum,
)
from app.schemas.schemas import UserResponse, RoleUpdateRequest, StaffAssignmentRequest
from app.core.security import RoleChecker, get_password_hash
from app.services.workflow import validate_transition, get_transition_map

router = APIRouter(tags=["Admin"])

require_admin = RoleChecker([RoleEnum.admin])


# ── Schemas local to admin ───────────────────────────────────────────

class CreateStaffRequest(BaseModel):
    org_name: str
    email: EmailStr
    password: str
    role: str = "officer"


class GrantProgrammeCreate(BaseModel):
    code: str
    title: str
    short_title: Optional[str] = None
    description: Optional[str] = None
    purpose: Optional[str] = None
    funding_min: float = 0
    funding_max: float = 0
    funding_range: Optional[str] = None
    duration_min: int = 6
    duration_max: int = 18
    eligible_types: Optional[str] = None  # JSON string
    min_years: int = 0
    deadline: Optional[str] = None
    geographic_focus: Optional[str] = None
    total_budget: Optional[str] = None
    max_awards: Optional[int] = None


# ══════════════════════════════════════════════════════════════════════
# 1. GET /admin/stats — Overview dashboard
# ══════════════════════════════════════════════════════════════════════

@router.get("/admin/stats")
def admin_stats(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    all_apps = db.query(Application).all()
    all_users = db.query(User).all()

    # Application counts by status
    by_status = {}
    for a in all_apps:
        s = a.status.value if a.status else "unknown"
        by_status[s] = by_status.get(s, 0) + 1

    # By grant type
    by_grant_type = {}
    for a in all_apps:
        gt = a.grant_type or "OTHER"
        by_grant_type[gt] = by_grant_type.get(gt, 0) + 1

    total_requested = sum(a.total_requested or 0 for a in all_apps)
    approved_apps = [a for a in all_apps if a.status == ApplicationStatusEnum.approved]
    total_approved = sum(a.total_requested or 0 for a in approved_apps)

    active_users = [u for u in all_users if u.is_active]

    return {
        "applications": {
            "total": len(all_apps),
            "approved": len(approved_apps),
            "pending": by_status.get("pending_review", 0) + by_status.get("screening", 0) + by_status.get("assigned", 0) + by_status.get("under_review", 0),
            "rejected": by_status.get("rejected", 0),
            "risk_flagged": by_status.get("risk_flagged", 0),
        },
        "financials": {
            "total_requested": total_requested,
            "total_approved": total_approved,
        },
        "users": {
            "total": len(all_users),
            "active": len(active_users),
        },
        "by_status": by_status,
        "by_grant_type": by_grant_type,
    }


# ══════════════════════════════════════════════════════════════════════
# 2. User Management
# ══════════════════════════════════════════════════════════════════════

@router.get("/admin/users", response_model=list[UserResponse])
def list_users(
    role: Optional[str] = Query(None),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(User)
    if role:
        try:
            role_enum = RoleEnum(role)
            query = query.filter(User.role == role_enum)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid role: {role}")
    return query.order_by(User.id).all()


@router.post("/admin/users", response_model=UserResponse)
def create_staff_user(
    body: CreateStaffRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Admin creates a staff account (officer, reviewer, finance, admin)."""
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        role_enum = RoleEnum(body.role)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid role: {body.role}")

    new_user = User(
        org_name=body.org_name,
        email=body.email,
        hashed_password=get_password_hash(body.password),
        role=role_enum,
        is_active=True,
    )
    db.add(new_user)
    db.add(AuditLog(
        actor_id=current_user.id,
        action="STAFF_CREATED",
        object_type="user",
        details={"email": body.email, "role": body.role},
    ))
    db.commit()
    db.refresh(new_user)
    return new_user


@router.patch("/admin/users/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: int,
    body: RoleUpdateRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    if target.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")

    if target.role == RoleEnum.admin and body.role != RoleEnum.admin:
        admin_count = db.query(User).filter(User.role == RoleEnum.admin).count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot remove the last admin")

    old_role = target.role.value
    target.role = body.role

    db.add(AuditLog(
        actor_id=current_user.id,
        action="ROLE_CHANGED",
        object_type="user",
        object_id=user_id,
        details={"old_role": old_role, "new_role": body.role.value},
    ))
    db.commit()
    db.refresh(target)
    return target


@router.patch("/admin/users/{user_id}/deactivate", response_model=UserResponse)
def deactivate_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if target.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")

    target.is_active = False
    db.add(AuditLog(
        actor_id=current_user.id,
        action="USER_DEACTIVATED",
        object_type="user",
        object_id=user_id,
    ))
    db.commit()
    db.refresh(target)
    return target


@router.patch("/admin/users/{user_id}/activate", response_model=UserResponse)
def activate_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    target.is_active = True
    db.add(AuditLog(
        actor_id=current_user.id,
        action="USER_ACTIVATED",
        object_type="user",
        object_id=user_id,
    ))
    db.commit()
    db.refresh(target)
    return target


# ── Staff listing for assignment dropdowns ───────────────────────────

@router.get("/admin/staff", response_model=list[UserResponse])
def list_staff(
    role: Optional[str] = Query(None),
    current_user: User = Depends(RoleChecker([RoleEnum.admin, RoleEnum.officer])),
    db: Session = Depends(get_db),
):
    staff_roles = [RoleEnum.officer, RoleEnum.reviewer, RoleEnum.finance, RoleEnum.admin]
    query = db.query(User).filter(User.role.in_(staff_roles))
    if role:
        try:
            role_enum = RoleEnum(role)
            query = query.filter(User.role == role_enum)
        except ValueError:
            pass
    return query.order_by(User.id).all()


# ══════════════════════════════════════════════════════════════════════
# 3. Grant Programmes CRUD
# ══════════════════════════════════════════════════════════════════════

@router.get("/admin/grants")
def list_grant_programmes(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    programmes = db.query(GrantProgramme).order_by(GrantProgramme.id).all()
    results = []
    for g in programmes:
        results.append({
            "id": g.id,
            "code": g.code,
            "title": g.title,
            "short_title": g.short_title,
            "description": g.description,
            "purpose": g.purpose,
            "funding_min": g.funding_min,
            "funding_max": g.funding_max,
            "funding_range": g.funding_range or f"INR {g.funding_min:,.0f} – {g.funding_max:,.0f}",
            "duration_min": g.duration_min,
            "duration_max": g.duration_max,
            "eligible_types": g.eligible_types,
            "min_years": g.min_years,
            "deadline": g.deadline,
            "geographic_focus": g.geographic_focus,
            "total_budget": g.total_budget,
            "max_awards": g.max_awards,
            "is_active": g.is_active,
            "created_at": g.created_at.isoformat() if g.created_at else None,
        })
    return results


@router.post("/admin/grants")
def create_grant_programme(
    body: GrantProgrammeCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if db.query(GrantProgramme).filter(GrantProgramme.code == body.code.upper()).first():
        raise HTTPException(status_code=400, detail=f"Grant programme '{body.code}' already exists")

    prog = GrantProgramme(
        code=body.code.upper(),
        title=body.title,
        short_title=body.short_title,
        description=body.description,
        purpose=body.purpose,
        funding_min=body.funding_min,
        funding_max=body.funding_max,
        funding_range=body.funding_range,
        duration_min=body.duration_min,
        duration_max=body.duration_max,
        eligible_types=body.eligible_types,
        min_years=body.min_years,
        deadline=body.deadline,
        geographic_focus=body.geographic_focus,
        total_budget=body.total_budget,
        max_awards=body.max_awards,
    )
    db.add(prog)
    db.add(AuditLog(
        actor_id=current_user.id,
        action="GRANT_CREATED",
        object_type="grant_programme",
        details={"code": prog.code, "title": prog.title},
    ))
    db.commit()
    db.refresh(prog)
    return {"id": prog.id, "code": prog.code, "message": f"Grant programme '{prog.code}' created"}


@router.patch("/admin/grants/{grant_id}/toggle")
def toggle_grant_programme(
    grant_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    prog = db.query(GrantProgramme).filter(GrantProgramme.id == grant_id).first()
    if not prog:
        raise HTTPException(status_code=404, detail="Grant programme not found")

    prog.is_active = not prog.is_active
    db.add(AuditLog(
        actor_id=current_user.id,
        action="GRANT_TOGGLED",
        object_type="grant_programme",
        object_id=grant_id,
        details={"code": prog.code, "is_active": prog.is_active},
    ))
    db.commit()
    return {"message": f"Grant '{prog.code}' is now {'active' if prog.is_active else 'inactive'}"}


# ══════════════════════════════════════════════════════════════════════
# 4. Audit Log
# ══════════════════════════════════════════════════════════════════════

@router.get("/admin/audit-log")
def get_audit_log(
    limit: int = Query(100, le=500),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    entries = (
        db.query(AuditLog)
        .order_by(AuditLog.timestamp.desc())
        .limit(limit)
        .all()
    )
    results = []
    for e in entries:
        actor_email = None
        if e.actor_id:
            actor = db.query(User).filter(User.id == e.actor_id).first()
            actor_email = actor.email if actor else None

        details_str = None
        if e.details:
            details_str = json.dumps(e.details) if isinstance(e.details, dict) else str(e.details)

        results.append({
            "id": e.id,
            "actor_id": e.actor_id,
            "actor_email": actor_email,
            "action": e.action,
            "object_type": e.object_type,
            "object_id": e.object_id,
            "details": details_str,
            "timestamp": e.timestamp.isoformat() if e.timestamp else None,
        })
    return results


# ══════════════════════════════════════════════════════════════════════
# 5. Application Assignment (workflow)
# ══════════════════════════════════════════════════════════════════════

@router.post("/admin/applications/{app_id}/assign")
def assign_application_to_staff(
    app_id: int,
    body: StaffAssignmentRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    staff = db.query(User).filter(User.id == body.staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff user not found")

    if staff.role == RoleEnum.applicant:
        raise HTTPException(status_code=400, detail="Cannot assign to an applicant")

    # Conflict of Interest check
    conflict_warning = None
    if staff.role == RoleEnum.reviewer:
        applicant = db.query(User).filter(User.id == app.applicant_id).first()
        app_email = app.contact_email or (applicant.email if applicant else "")
        staff_domain = staff.email.split("@")[-1].lower() if "@" in staff.email else ""
        app_domain = app_email.split("@")[-1].lower() if "@" in app_email else ""

        if staff_domain and app_domain and staff_domain == app_domain:
            conflict_warning = (
                f"Conflict of Interest: Reviewer '{staff.org_name}' ({staff.email}) "
                f"shares email domain '@{staff_domain}' with applicant ({app_email})."
            )
            if not body.force:
                return {
                    "warning": True,
                    "conflict": conflict_warning,
                    "message": "Conflict of interest detected. Set force=true to proceed.",
                }

    # Validate status transition
    new_status = ApplicationStatusEnum.assigned
    validate_transition(app.status, new_status)
    app.status = new_status

    db.add(AuditLog(
        actor_id=current_user.id,
        action="APPLICATION_ASSIGNED",
        object_type="application",
        object_id=app_id,
        details={
            "staff_id": staff.id,
            "staff_email": staff.email,
            "staff_role": staff.role.value,
            "conflict_warning": conflict_warning,
        },
    ))
    db.commit()

    return {
        "message": f"Application {app.reference_id} assigned to {staff.org_name}",
        "conflict_warning": conflict_warning,
    }


# ══════════════════════════════════════════════════════════════════════
# 6. Workflow Transitions Map
# ══════════════════════════════════════════════════════════════════════

@router.get("/workflow/transitions")
def workflow_transitions(
    current_user: User = Depends(RoleChecker([RoleEnum.admin, RoleEnum.officer])),
):
    return get_transition_map()
