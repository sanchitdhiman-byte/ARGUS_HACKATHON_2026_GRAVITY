"""
Shared helper functions for GrantFlow routers.
"""
import json
from sqlalchemy.orm import Session
import models


def create_notification(
    db: Session,
    user_id: int,
    event_type: str,
    title: str,
    content: str,
    application_id: int = None
) -> models.Notification:
    """Create a notification record. Caller is responsible for committing."""
    notif = models.Notification(
        user_id=user_id,
        event_type=event_type,
        title=title,
        content=content,
        application_id=application_id
    )
    db.add(notif)
    return notif


def create_audit_log(
    db: Session,
    actor_id: int,
    actor_email: str,
    action: str,
    object_type: str,
    object_id: int = None,
    detail: dict = None
) -> models.AuditLog:
    """Create an audit log entry. Caller is responsible for committing."""
    log = models.AuditLog(
        actor_id=actor_id,
        actor_email=actor_email,
        action=action,
        object_type=object_type,
        object_id=object_id,
        detail=json.dumps(detail) if detail else None
    )
    db.add(log)
    return log
