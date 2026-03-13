"""
Module 7 - Communications
Messaging threads, notifications, and read-status management.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import database, models, schemas, auth
from helpers import create_notification, create_audit_log

router = APIRouter(tags=["communications"])


# ─── Messages ────────────────────────────────────────────────────────────────

@router.get("/applications/{app_id}/messages", response_model=list[schemas.MessageResponse])
def get_messages(
    app_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get message thread for an application.
    Applicants cannot see internal (staff-only) notes.
    """
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")

    query = db.query(models.Message).filter(models.Message.application_id == app_id)

    # Applicants can't see internal notes
    if current_user.role == models.RoleEnum.applicant:
        query = query.filter(models.Message.is_internal == False)

    return query.order_by(models.Message.created_at.asc()).all()


@router.post("/applications/{app_id}/messages", response_model=schemas.MessageResponse)
def send_message(
    app_id: int,
    req: schemas.MessageCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Send a message in an application thread."""
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == models.RoleEnum.applicant and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised to message on this application")

    # Applicants can't send internal notes
    is_internal = req.is_internal
    if current_user.role == models.RoleEnum.applicant:
        is_internal = False

    message = models.Message(
        application_id=app_id,
        sender_id=current_user.id,
        content=req.content,
        is_internal=is_internal
    )
    db.add(message)

    # Determine recipients for notification
    if current_user.role == models.RoleEnum.applicant:
        # Notify staff
        staff = db.query(models.User).filter(
            models.User.role.in_([models.RoleEnum.officer, models.RoleEnum.admin])
        ).all()
        for s in staff:
            create_notification(
                db, s.id, "message_received",
                f"New Message: {app.reference_id}",
                f"Message from {current_user.email} regarding application {app.reference_id}: {req.content[:100]}...",
                application_id=app_id
            )
    else:
        # Notify applicant (only if not internal)
        if not is_internal:
            create_notification(
                db, app.applicant_id, "message_received",
                f"New Message on {app.reference_id}",
                f"You have a new message regarding your application {app.reference_id}: {req.content[:100]}...",
                application_id=app_id
            )

    create_audit_log(
        db, current_user.id, current_user.email,
        "message.sent", "message",
        detail={"application_id": app_id, "is_internal": is_internal}
    )

    db.commit()
    db.refresh(message)
    return message


# ─── Notifications ───────────────────────────────────────────────────────────

@router.get("/notifications", response_model=list[schemas.NotificationResponse])
def get_notifications(
    is_read: bool = None,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """List notifications for the current user."""
    query = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    )
    if is_read is not None:
        query = query.filter(models.Notification.is_read == is_read)

    return query.order_by(models.Notification.created_at.desc()).all()


@router.patch("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Mark a single notification as read."""
    notif = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}


@router.post("/notifications/mark-all-read")
def mark_all_notifications_read(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Mark all notifications for the current user as read."""
    db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}
