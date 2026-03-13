import enum
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Float, Text, Enum, ForeignKey, DateTime, Boolean, JSON,
)
from sqlalchemy.orm import relationship

from app.db.session import Base


class RoleEnum(str, enum.Enum):
    applicant = "applicant"
    reviewer = "reviewer"
    officer = "officer"
    finance = "finance"
    admin = "admin"


class ApplicationStatusEnum(str, enum.Enum):
    draft = "draft"
    submitted = "submitted"
    screening = "screening"
    eligible = "eligible"
    ineligible = "ineligible"
    pending_review = "pending_review"
    assigned = "assigned"
    under_review = "under_review"
    reviewed = "reviewed"
    risk_flagged = "risk_flagged"
    approved = "approved"
    rejected = "rejected"
    waitlisted = "waitlisted"
    agreement_sent = "agreement_sent"
    agreement_acknowledged = "agreement_acknowledged"
    active_reporting = "active_reporting"
    closed = "closed"


class NotificationTypeEnum(str, enum.Enum):
    application_submitted = "application_submitted"
    screening_eligible = "screening_eligible"
    screening_ineligible = "screening_ineligible"
    clarification_requested = "clarification_requested"
    review_assigned = "review_assigned"
    review_due_reminder = "review_due_reminder"
    award_approved = "award_approved"
    application_rejected = "application_rejected"
    agreement_sent = "agreement_sent"
    tranche_released = "tranche_released"
    report_due_reminder = "report_due_reminder"
    report_overdue = "report_overdue"
    report_approved = "report_approved"


# ── Users ──────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    org_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    google_id = Column(String, unique=True, index=True, nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.applicant)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("Application", back_populates="applicant", foreign_keys="Application.applicant_id")
    reviews = relationship("Review", back_populates="reviewer")


# ── Applications ───────────────────────────────────────────────────────

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String, unique=True, index=True)
    applicant_id = Column(Integer, ForeignKey("users.id"))
    grant_type = Column(String)  # CDG, EIG, ECAG

    # Organisation
    org_name = Column(String)
    reg_number = Column(String)
    entity_type = Column(String)
    established_year = Column(Integer, nullable=True)
    org_budget = Column(Float, nullable=True)
    contact_name = Column(String)
    contact_role = Column(String)
    contact_email = Column(String)
    contact_phone = Column(String)
    address = Column(String)
    city = Column(String)
    state_region = Column(String)
    postal_code = Column(String)

    # Project
    project_title = Column(String)
    project_location = Column(String)
    target_beneficiaries = Column(Integer, nullable=True)
    problem_statement = Column(Text)
    proposed_solution = Column(Text)
    sustainability_plan = Column(Text, nullable=True)
    schools_targeted = Column(Integer, nullable=True)
    grade_coverage = Column(String, nullable=True)

    # Budget
    total_requested = Column(Float)
    budget_personnel = Column(Float, nullable=True)
    budget_equipment = Column(Float, nullable=True)
    budget_travel = Column(Float, nullable=True)
    budget_overheads = Column(Float, nullable=True)
    budget_other = Column(Float, nullable=True)
    budget_justification = Column(Text, nullable=True)

    # Experience
    prior_projects = Column(Text, nullable=True)  # JSON string
    has_previous_grants = Column(Boolean, default=False)
    prior_funder = Column(String, nullable=True)
    prior_amount = Column(Float, nullable=True)
    signatory_name = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    submission_date = Column(String, nullable=True)
    declared = Column(Boolean, default=False)

    status = Column(Enum(ApplicationStatusEnum), default=ApplicationStatusEnum.screening)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    # AI Scoring
    ai_score_alignment = Column(Integer, default=0)
    ai_score_feasibility = Column(Integer, default=0)
    ai_score_impact = Column(Integer, default=0)
    ai_score = Column(Integer, default=0)
    ai_summary = Column(Text, nullable=True)

    # Screening
    screening_report = Column(JSON, nullable=True)
    screening_completed_at = Column(DateTime, nullable=True)

    # AI Review Package
    ai_review_package = Column(JSON, nullable=True)

    applicant = relationship("User", back_populates="applications", foreign_keys=[applicant_id])
    reviews = relationship("Review", back_populates="application")
    compliance_reports = relationship("ComplianceReport", back_populates="application")
    disbursements = relationship("Disbursement", back_populates="application")
    messages = relationship("Message", back_populates="application")


# ── Reviews ────────────────────────────────────────────────────────────

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    score_alignment = Column(Integer, nullable=True)
    score_feasibility = Column(Integer, nullable=True)
    score_impact = Column(Integer, nullable=True)
    score_budget = Column(Integer, nullable=True)
    score_track_record = Column(Integer, nullable=True)
    total_score = Column(Integer, nullable=True)
    comments = Column(Text)
    ai_overrides = Column(JSON, nullable=True)  # tracks which AI scores were overridden
    status = Column(String, default="in_progress")  # in_progress, submitted
    created_at = Column(DateTime, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)

    application = relationship("Application", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews")


# ── Compliance Reports ─────────────────────────────────────────────────

class ComplianceReport(Base):
    __tablename__ = "compliance_reports"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    report_type = Column(String)  # progress, mid_project, quarterly, final
    due_date = Column(DateTime)
    submitted_date = Column(DateTime, nullable=True)
    status = Column(String, default="pending")  # pending, submitted, under_review, approved, clarification_needed
    report_data = Column(JSON, nullable=True)
    ai_analysis = Column(JSON, nullable=True)
    officer_comments = Column(Text, nullable=True)
    file_path = Column(String, nullable=True)

    application = relationship("Application", back_populates="compliance_reports")


# ── Disbursements ──────────────────────────────────────────────────────

class Disbursement(Base):
    __tablename__ = "disbursements"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    amount = Column(Float)
    tranche_name = Column(String)
    trigger_condition = Column(String, nullable=True)
    scheduled_date = Column(DateTime, nullable=True)
    disbursed_date = Column(DateTime, nullable=True)
    status = Column(String, default="pending")  # pending, ready, processing, disbursed

    application = relationship("Application", back_populates="disbursements")


# ── Notifications ──────────────────────────────────────────────────────

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    notification_type = Column(Enum(NotificationTypeEnum))
    title = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    reference_id = Column(String, nullable=True)  # e.g. application reference
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


# ── Messages ───────────────────────────────────────────────────────────

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    is_internal_note = Column(Boolean, default=False)  # visible only to staff
    created_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="messages")
    sender = relationship("User")


# ── Audit Log ──────────────────────────────────────────────────────────

class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String)
    object_type = Column(String)
    object_id = Column(Integer, nullable=True)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    actor = relationship("User")
