from sqlalchemy import Column, Integer, String, Float, Text, Enum, ForeignKey, DateTime, Boolean
from database import Base
import enum
from datetime import datetime


class RoleEnum(str, enum.Enum):
    applicant = "applicant"
    reviewer = "reviewer"
    officer = "officer"
    finance = "finance"
    admin = "admin"


class ApplicationStatusEnum(str, enum.Enum):
    draft = "draft"
    screening = "screening"
    pending_review = "pending_review"
    assigned = "assigned"
    under_review = "under_review"
    reviewed = "reviewed"
    risk_flagged = "risk_flagged"
    approved = "approved"
    rejected = "rejected"
    waitlisted = "waitlisted"
    agreement_sent = "agreement_sent"
    active = "active"
    active_reporting = "active_reporting"
    closed = "closed"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=True)
    org_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    google_id = Column(String, unique=True, index=True, nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.applicant)
    is_active = Column(Boolean, default=True)


class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String, unique=True, index=True)
    applicant_id = Column(Integer, ForeignKey("users.id"))
    grant_type = Column(String)  # CDG, EIG, ECAG

    # Org
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

    # Extended fields
    project_type = Column(String, nullable=True)
    beneficiary_demographics = Column(Text, nullable=True)
    key_activities = Column(Text, nullable=True)  # JSON string
    expected_outcomes = Column(Text, nullable=True)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    district = Column(String, nullable=True)
    state = Column(String, nullable=True)
    annual_operating_budget = Column(Float, nullable=True)

    # EIG-specific
    innovation_type = Column(String, nullable=True)
    target_schools_districts = Column(Text, nullable=True)
    number_of_schools = Column(Integer, nullable=True)
    number_of_students = Column(Integer, nullable=True)
    grade_levels = Column(String, nullable=True)
    tech_tools = Column(Text, nullable=True)
    evidence_base = Column(Text, nullable=True)
    team_lead_name = Column(String, nullable=True)
    team_size = Column(Integer, nullable=True)
    team_expertise = Column(Text, nullable=True)
    key_partners = Column(Text, nullable=True)
    primary_learning_outcome = Column(Text, nullable=True)
    measurement_plan = Column(Text, nullable=True)
    baseline_assessment_plan = Column(Text, nullable=True)
    milestones = Column(Text, nullable=True)  # JSON string
    budget_technology = Column(Float, nullable=True)
    budget_training = Column(Float, nullable=True)
    budget_content = Column(Float, nullable=True)

    # ECAG-specific
    thematic_area = Column(String, nullable=True)
    environmental_problem = Column(Text, nullable=True)
    proposed_intervention = Column(Text, nullable=True)
    geographic_coverage = Column(String, nullable=True)
    community_involvement_plan = Column(Text, nullable=True)
    environmental_indicators = Column(Text, nullable=True)  # JSON
    climate_vulnerability_context = Column(Text, nullable=True)
    risk_of_not_acting = Column(Text, nullable=True)
    government_partnerships = Column(Text, nullable=True)
    activity_plan = Column(Text, nullable=True)  # JSON
    budget_community_wages = Column(Float, nullable=True)
    budget_saplings = Column(Float, nullable=True)
    budget_technical_expertise = Column(Float, nullable=True)

    # Screening & decision
    screening_status = Column(String, default="pending")  # pending/pass/fail
    ai_review_package = Column(Text, nullable=True)  # JSON
    final_decision = Column(String, nullable=True)  # approved/rejected/waitlisted
    decision_reason = Column(Text, nullable=True)
    decision_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    decision_at = Column(DateTime, nullable=True)


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
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="in_progress")  # in_progress, submitted
    submitted_at = Column(DateTime, nullable=True)
    ai_package_generated = Column(Boolean, default=False)


class ComplianceReport(Base):
    __tablename__ = "compliance_reports"
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    report_type = Column(String)  # UC, Narrative
    due_date = Column(DateTime)
    submitted_date = Column(DateTime, nullable=True)
    status = Column(String, default="Pending")  # Pending, Submitted, Verified
    comments = Column(Text, nullable=True)
    file_path = Column(String, nullable=True)


class Disbursement(Base):
    __tablename__ = "disbursements"
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    amount = Column(Float)
    tranche_name = Column(String)
    scheduled_date = Column(DateTime, nullable=True)
    disbursed_date = Column(DateTime, nullable=True)
    status = Column(String, default="Pending")  # Pending, Processing, Disbursed


class OrganisationProfile(Base):
    __tablename__ = "org_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    org_name = Column(String)
    registration_number = Column(String, nullable=True)
    org_type = Column(String, nullable=True)  # NGO, Trust, Section8, FPO, etc.
    year_established = Column(Integer, nullable=True)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    annual_budget = Column(Float, nullable=True)
    contact_person = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=True)
    doc_type = Column(String)  # registration_cert, audited_financials, 80g_cert, fcra, board_resolution, etc.
    filename = Column(String)
    file_path = Column(String)
    file_size = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    is_vault = Column(Boolean, default=True)  # True = personal vault, False = app-specific


class ScreeningReport(Base):
    __tablename__ = "screening_reports"
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True)
    generated_at = Column(DateTime, default=datetime.utcnow)
    check_results = Column(Text)  # JSON blob of all check results
    thematic_alignment_score = Column(Float, nullable=True)
    thematic_alignment_flag = Column(Boolean, default=False)
    narrative_quality_flag = Column(Boolean, default=False)
    narrative_quality_detail = Column(Text, nullable=True)
    overall_result = Column(String)  # eligible, ineligible, needs_review
    ai_summary = Column(Text, nullable=True)
    po_decision = Column(String, nullable=True)  # confirm_eligible, override_ineligible, clarification_requested
    po_decision_reason = Column(Text, nullable=True)
    po_reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    po_reviewed_at = Column(DateTime, nullable=True)


class ReviewerAssignment(Base):
    __tablename__ = "reviewer_assignments"
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    assigned_by = Column(Integer, ForeignKey("users.id"))
    assigned_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="assigned")  # assigned, in_progress, complete


class ReviewDimension(Base):
    __tablename__ = "review_dimensions"
    id = Column(Integer, primary_key=True)
    review_id = Column(Integer, ForeignKey("reviews.id"))
    dimension_name = Column(String)
    weight = Column(Float)
    ai_suggested_score = Column(Integer, nullable=True)  # 1-5
    ai_justification = Column(Text, nullable=True)
    ai_section_reference = Column(String, nullable=True)
    human_score = Column(Integer, nullable=True)  # 1-5
    override_comment = Column(Text, nullable=True)
    is_confirmed = Column(Boolean, default=False)


class TextAnnotation(Base):
    __tablename__ = "text_annotations"
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    selected_text = Column(Text)
    note = Column(Text)
    section_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class GrantAgreement(Base):
    __tablename__ = "grant_agreements"
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True)
    grant_reference = Column(String, unique=True)
    agreement_text = Column(Text)
    special_conditions = Column(Text, nullable=True)
    generated_by = Column(Integer, ForeignKey("users.id"))
    generated_at = Column(DateTime, default=datetime.utcnow)
    sent_at = Column(DateTime, nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)
    status = Column(String, default="draft")  # draft, sent, acknowledged


class DisbursementTranche(Base):
    __tablename__ = "disbursement_tranches"
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    label = Column(String)
    amount = Column(Float)
    tranche_type = Column(String)  # inception, mid_project, final, milestone
    trigger_condition = Column(String)
    status = Column(String, default="pending")  # pending, ready, disbursed
    disbursed_at = Column(DateTime, nullable=True)
    disbursed_by = Column(Integer, ForeignKey("users.id"), nullable=True)


class BankDetails(Base):
    __tablename__ = "bank_details"
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True)
    account_number = Column(String)
    ifsc_code = Column(String)
    beneficiary_name = Column(String)
    bank_name = Column(String, nullable=True)
    added_by = Column(Integer, ForeignKey("users.id"))
    added_at = Column(DateTime, default=datetime.utcnow)


class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    report_type = Column(String)  # progress_6month, quarterly, mid_project, final
    period_label = Column(String, nullable=True)
    due_date = Column(DateTime, nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    status = Column(String, default="due")  # due, submitted, under_review, approved, clarification_requested, compliance_action
    activities_completed = Column(Text, nullable=True)
    activities_not_completed = Column(Text, nullable=True)
    activities_next_period = Column(Text, nullable=True)
    beneficiaries_reached = Column(Integer, nullable=True)
    beneficiaries_male = Column(Integer, nullable=True)
    beneficiaries_female = Column(Integer, nullable=True)
    beneficiaries_other = Column(Integer, nullable=True)
    outcomes_progress = Column(Text, nullable=True)
    key_challenges = Column(Text, nullable=True)
    expenditure_period = Column(Float, nullable=True)
    expenditure_cumulative = Column(Float, nullable=True)
    expenditure_by_line = Column(Text, nullable=True)  # JSON
    variance_explanation = Column(Text, nullable=True)
    plans_next_period = Column(Text, nullable=True)
    support_needed = Column(Text, nullable=True)
    overall_achievement = Column(Text, nullable=True)
    final_beneficiaries = Column(Integer, nullable=True)
    key_outcomes_achieved = Column(Text, nullable=True)
    lessons_learned = Column(Text, nullable=True)
    final_financial_statement = Column(Text, nullable=True)
    compliance_analysis = Column(Text, nullable=True)  # JSON
    compliance_rating = Column(String, nullable=True)  # satisfactory, needs_clarification, concerns_found
    po_action = Column(String, nullable=True)  # approved, clarification_requested, compliance_action
    po_action_reason = Column(Text, nullable=True)
    compliance_severity = Column(String, nullable=True)  # warning, disbursement_hold
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)


class ExpenditureRecord(Base):
    __tablename__ = "expenditure_records"
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=True)
    date = Column(String)  # ISO date
    payee = Column(String)
    amount = Column(Float)
    budget_category = Column(String)  # personnel, equipment, travel, overheads, other
    description = Column(Text)
    receipt_path = Column(String, nullable=True)
    status = Column(String, default="pending")  # pending, verified, queried
    submitted_by = Column(Integer, ForeignKey("users.id"))
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    is_internal = Column(Boolean, default=False)
    parent_id = Column(Integer, ForeignKey("messages.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_type = Column(String)
    title = Column(String)
    content = Column(Text)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True)
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    actor_email = Column(String, nullable=True)
    action = Column(String)
    object_type = Column(String)
    object_id = Column(Integer, nullable=True)
    detail = Column(Text, nullable=True)  # JSON
    timestamp = Column(DateTime, default=datetime.utcnow)
