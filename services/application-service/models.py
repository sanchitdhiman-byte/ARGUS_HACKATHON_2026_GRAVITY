import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, Enum, ForeignKey
from database import Base


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


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = {"schema": "applications"}

    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String, unique=True, index=True)
    applicant_id = Column(Integer, index=True)
    grant_type = Column(String)

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
    prior_projects = Column(Text, nullable=True)
    has_previous_grants = Column(Boolean, default=False)
    prior_funder = Column(String, nullable=True)
    prior_amount = Column(Float, nullable=True)
    signatory_name = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    submission_date = Column(String, nullable=True)
    declared = Column(Boolean, default=False)

    status = Column(Enum(ApplicationStatusEnum, schema="applications"), default=ApplicationStatusEnum.screening)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    # AI Scoring
    ai_score = Column(Integer, default=0)
    ai_summary = Column(Text, nullable=True)

    # Extended fields
    project_type = Column(String, nullable=True)
    beneficiary_demographics = Column(Text, nullable=True)
    key_activities = Column(Text, nullable=True)
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
    milestones = Column(Text, nullable=True)
    budget_technology = Column(Float, nullable=True)
    budget_training = Column(Float, nullable=True)
    budget_content = Column(Float, nullable=True)

    # ECAG-specific
    thematic_area = Column(String, nullable=True)
    environmental_problem = Column(Text, nullable=True)
    proposed_intervention = Column(Text, nullable=True)
    geographic_coverage = Column(String, nullable=True)
    community_involvement_plan = Column(Text, nullable=True)
    environmental_indicators = Column(Text, nullable=True)
    climate_vulnerability_context = Column(Text, nullable=True)
    risk_of_not_acting = Column(Text, nullable=True)
    government_partnerships = Column(Text, nullable=True)
    activity_plan = Column(Text, nullable=True)
    budget_community_wages = Column(Float, nullable=True)
    budget_saplings = Column(Float, nullable=True)
    budget_technical_expertise = Column(Float, nullable=True)

    # Screening & decision
    screening_status = Column(String, default="pending")
    ai_review_package = Column(Text, nullable=True)
    final_decision = Column(String, nullable=True)
    decision_reason = Column(Text, nullable=True)
    decision_by = Column(Integer, nullable=True)
    decision_at = Column(DateTime, nullable=True)


class OrganisationProfile(Base):
    __tablename__ = "org_profiles"
    __table_args__ = {"schema": "applications"}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, unique=True, index=True)
    org_name = Column(String)
    registration_number = Column(String, nullable=True)
    org_type = Column(String, nullable=True)
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
    __table_args__ = {"schema": "applications"}

    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, index=True)
    application_id = Column(Integer, nullable=True)
    doc_type = Column(String)
    filename = Column(String)
    file_path = Column(String)
    file_size = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    is_vault = Column(Boolean, default=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    __table_args__ = {"schema": "admin"}

    id = Column(Integer, primary_key=True)
    actor_id = Column(Integer, nullable=True)
    actor_email = Column(String, nullable=True)
    action = Column(String)
    object_type = Column(String)
    object_id = Column(Integer, nullable=True)
    detail = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"
    __table_args__ = {"schema": "comms"}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    event_type = Column(String)
    title = Column(String)
    content = Column(Text)
    application_id = Column(Integer, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
