"""Admin endpoints: user management, workflow assignment, RBAC."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import User, Application, AuditLog, RoleEnum, ApplicationStatusEnum
from app.schemas.schemas import UserResponse, RoleUpdateRequest, StaffAssignmentRequest
from app.core.security import RoleChecker
from app.services.workflow import validate_transition, get_transition_map

router = APIRouter(tags=["Admin"])

require_admin = RoleChecker([RoleEnum.admin])


# ── User Management ──────────────────────────────────────────────────

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

    # Prevent removing the last admin
    if target.role == RoleEnum.admin and body.role != RoleEnum.admin:
        admin_count = db.query(User).filter(User.role == RoleEnum.admin).count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot remove the last admin")

    old_role = target.role.value
    target.role = body.role

    db.add(AuditLog(
        actor_id=current_user.id,
        action="change_role",
        object_type="user",
        object_id=user_id,
        details={"old_role": old_role, "new_role": body.role.value},
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
    """List staff users (non-applicants). Optionally filter by role."""
    staff_roles = [RoleEnum.officer, RoleEnum.reviewer, RoleEnum.finance, RoleEnum.admin]
    query = db.query(User).filter(User.role.in_(staff_roles))
    if role:
        try:
            role_enum = RoleEnum(role)
            query = query.filter(User.role == role_enum)
        except ValueError:
            pass
    return query.order_by(User.id).all()


# ── Application Assignment ───────────────────────────────────────────

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

    # ── Conflict of Interest check ───────────────────────────────────
    conflict_warning = None
    if staff.role == RoleEnum.reviewer:
        # Get applicant's email domain
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

    # Validate status transition → assigned
    new_status = ApplicationStatusEnum.assigned
    validate_transition(app.status, new_status)
    app.status = new_status

    # Audit
    db.add(AuditLog(
        actor_id=current_user.id,
        action="assign_to_staff",
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


# ── Workflow Transitions Map ─────────────────────────────────────────

@router.get("/workflow/transitions")
def workflow_transitions(
    current_user: User = Depends(RoleChecker([RoleEnum.admin, RoleEnum.officer])),
):
    return get_transition_map()
