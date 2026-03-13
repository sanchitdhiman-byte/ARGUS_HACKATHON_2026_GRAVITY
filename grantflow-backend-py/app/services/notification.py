"""Event-driven in-app notification service."""

import logging
from sqlalchemy.orm import Session

from app.models.models import Notification, NotificationTypeEnum

logger = logging.getLogger(__name__)


def create_notification(
    db: Session,
    user_id: int,
    notification_type: NotificationTypeEnum,
    title: str,
    message: str,
    reference_id: str | None = None,
) -> Notification:
    notif = Notification(
        user_id=user_id,
        notification_type=notification_type,
        title=title,
        message=message,
        reference_id=reference_id,
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    logger.info(f"Notification [{notification_type.value}] sent to user {user_id}: {title}")
    return notif


# ── Event Helpers ──────────────────────────────────────────────────────

def notify_application_submitted(db: Session, user_id: int, reference_id: str):
    create_notification(
        db, user_id, NotificationTypeEnum.application_submitted,
        "Application Submitted",
        f"Your application {reference_id} has been received and is being screened.",
        reference_id,
    )


def notify_screening_result(db: Session, user_id: int, reference_id: str, eligible: bool, reasons: str = ""):
    if eligible:
        create_notification(
            db, user_id, NotificationTypeEnum.screening_eligible,
            "Application Passed Screening",
            f"Your application {reference_id} has passed initial screening and is under review.",
            reference_id,
        )
    else:
        create_notification(
            db, user_id, NotificationTypeEnum.screening_ineligible,
            "Application Did Not Pass Screening",
            f"Your application {reference_id} did not meet eligibility criteria. {reasons}",
            reference_id,
        )


def notify_review_assigned(db: Session, reviewer_id: int, reference_id: str):
    create_notification(
        db, reviewer_id, NotificationTypeEnum.review_assigned,
        "Review Assignment",
        f"You have been assigned to review application {reference_id}.",
        reference_id,
    )


def notify_award_decision(db: Session, user_id: int, reference_id: str, decision: str, reason: str = ""):
    if decision == "approved":
        create_notification(
            db, user_id, NotificationTypeEnum.award_approved,
            "Application Approved",
            f"Congratulations! Your application {reference_id} has been approved.",
            reference_id,
        )
    elif decision == "rejected":
        create_notification(
            db, user_id, NotificationTypeEnum.application_rejected,
            "Application Not Approved",
            f"Your application {reference_id} was not approved. Reason: {reason}",
            reference_id,
        )


def notify_report_approved(db: Session, user_id: int, reference_id: str):
    create_notification(
        db, user_id, NotificationTypeEnum.report_approved,
        "Report Approved",
        f"Your report for grant {reference_id} has been approved. Next tranche will be released.",
        reference_id,
    )


def notify_clarification_requested(db: Session, user_id: int, reference_id: str, question: str):
    create_notification(
        db, user_id, NotificationTypeEnum.clarification_requested,
        "Clarification Requested",
        f"The Program Officer has requested clarification on your application {reference_id}: {question}",
        reference_id,
    )
