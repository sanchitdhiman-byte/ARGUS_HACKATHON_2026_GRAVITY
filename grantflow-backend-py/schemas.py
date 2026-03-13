from pydantic import BaseModel, EmailStr, Field, model_validator
from typing import Optional, List, Dict, Any
from models import RoleEnum, ApplicationStatusEnum
from datetime import datetime


# ─── Auth / User ─────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    org_name: str
    email: EmailStr
    role: RoleEnum


class UserCreate(UserBase):
    password: Optional[str] = None
    google_id: Optional[str] = None
    full_name: Optional[str] = None


class UserResponse(UserBase):
    id: int
    full_name: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str


class GoogleLoginRequest(BaseModel):
    token: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenRefreshRequest(BaseModel):
    refresh_token: str


# ─── Application ─────────────────────────────────────────────────────────────

class ApplicationCreate(BaseModel):
    grantType: str
    formData: Dict[str, Any]


class ApplicationResponse(BaseModel):
    id: int
    reference_id: str
    applicant_id: int
    status: ApplicationStatusEnum
    grant_type: str
    org_name: str
    requested_amount: float = 0.0
    submitted_at: datetime
    ai_score: int = 0
    ai_summary: Optional[str] = None
    screening_status: Optional[str] = None
    final_decision: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def map_total_requested(cls, values):
        # Support ORM objects and dicts
        if hasattr(values, "__dict__"):
            # ORM object
            if not hasattr(values, "requested_amount") or values.__dict__.get("requested_amount") is None:
                values.__dict__["requested_amount"] = getattr(values, "total_requested", 0.0) or 0.0
        elif isinstance(values, dict):
            if "requested_amount" not in values or values["requested_amount"] is None:
                values["requested_amount"] = values.get("total_requested", 0.0) or 0.0
        return values

    class Config:
        from_attributes = True


class ApplicationDetailResponse(BaseModel):
    id: int
    reference_id: str
    applicant_id: int
    status: ApplicationStatusEnum
    grant_type: str
    org_name: Optional[str] = None
    requested_amount: float = 0.0
    submitted_at: Optional[datetime] = None
    ai_score: int = 0
    ai_summary: Optional[str] = None
    reg_number: Optional[str] = None
    entity_type: Optional[str] = None
    established_year: Optional[int] = None
    org_budget: Optional[float] = None
    contact_name: Optional[str] = None
    contact_role: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state_region: Optional[str] = None
    postal_code: Optional[str] = None
    project_title: Optional[str] = None
    project_location: Optional[str] = None
    target_beneficiaries: Optional[int] = None
    problem_statement: Optional[str] = None
    proposed_solution: Optional[str] = None
    sustainability_plan: Optional[str] = None
    schools_targeted: Optional[int] = None
    grade_coverage: Optional[str] = None
    total_requested: Optional[float] = None
    budget_personnel: Optional[float] = None
    budget_equipment: Optional[float] = None
    budget_travel: Optional[float] = None
    budget_overheads: Optional[float] = None
    budget_other: Optional[float] = None
    budget_justification: Optional[str] = None
    prior_projects: Optional[str] = None
    has_previous_grants: Optional[bool] = None
    prior_funder: Optional[str] = None
    prior_amount: Optional[float] = None
    signatory_name: Optional[str] = None
    designation: Optional[str] = None
    submission_date: Optional[str] = None
    declared: Optional[bool] = None
    screening_status: Optional[str] = None
    ai_review_package: Optional[str] = None
    final_decision: Optional[str] = None
    decision_reason: Optional[str] = None
    decision_by: Optional[int] = None
    decision_at: Optional[datetime] = None
    # Extended
    project_type: Optional[str] = None
    beneficiary_demographics: Optional[str] = None
    key_activities: Optional[str] = None
    expected_outcomes: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def map_total_requested(cls, values):
        if hasattr(values, "__dict__"):
            if not hasattr(values, "requested_amount") or values.__dict__.get("requested_amount") is None:
                values.__dict__["requested_amount"] = getattr(values, "total_requested", 0.0) or 0.0
        elif isinstance(values, dict):
            if "requested_amount" not in values or values["requested_amount"] is None:
                values["requested_amount"] = values.get("total_requested", 0.0) or 0.0
        return values

    class Config:
        from_attributes = True


# ─── Review ──────────────────────────────────────────────────────────────────

class ReviewCreate(BaseModel):
    application_id: int
    score_alignment: int
    score_feasibility: int
    score_impact: int
    score_budget: Optional[int] = 0
    score_track_record: Optional[int] = 0
    comments: str


class ReviewResponse(ReviewCreate):
    id: int
    reviewer_id: int
    created_at: datetime
    status: str = "in_progress"
    submitted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Organisation Profile ─────────────────────────────────────────────────────

class OrgProfileCreate(BaseModel):
    org_name: str
    registration_number: Optional[str] = None
    org_type: Optional[str] = None
    year_established: Optional[int] = None
    state: Optional[str] = None
    district: Optional[str] = None
    annual_budget: Optional[float] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None


class OrgProfileResponse(OrgProfileCreate):
    id: int
    user_id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Document ────────────────────────────────────────────────────────────────

class DocumentResponse(BaseModel):
    id: int
    owner_id: int
    application_id: Optional[int] = None
    doc_type: str
    filename: str
    file_path: str
    file_size: Optional[int] = None
    uploaded_at: datetime
    is_vault: bool

    class Config:
        from_attributes = True


# ─── Screening ───────────────────────────────────────────────────────────────

class ScreeningReportResponse(BaseModel):
    id: int
    application_id: int
    generated_at: datetime
    check_results: Optional[str] = None
    thematic_alignment_score: Optional[float] = None
    thematic_alignment_flag: bool = False
    narrative_quality_flag: bool = False
    narrative_quality_detail: Optional[str] = None
    overall_result: str
    ai_summary: Optional[str] = None
    po_decision: Optional[str] = None
    po_decision_reason: Optional[str] = None
    po_reviewed_by: Optional[int] = None
    po_reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ScreeningDecisionRequest(BaseModel):
    decision: str  # confirm_eligible, override_ineligible, clarification_requested
    reason: str
    clarification_question: Optional[str] = None


# ─── Reviewer Assignment ─────────────────────────────────────────────────────

class AssignReviewerRequest(BaseModel):
    reviewer_id: int


class ReviewerAssignmentResponse(BaseModel):
    id: int
    application_id: int
    reviewer_id: int
    assigned_by: int
    assigned_at: datetime
    status: str

    class Config:
        from_attributes = True


# ─── Review Dimension ────────────────────────────────────────────────────────

class ReviewDimensionUpdate(BaseModel):
    dimension_name: str
    human_score: int = Field(ge=1, le=5)
    override_comment: Optional[str] = None


class ReviewDimensionResponse(BaseModel):
    id: int
    review_id: int
    dimension_name: str
    weight: float
    ai_suggested_score: Optional[int] = None
    ai_justification: Optional[str] = None
    ai_section_reference: Optional[str] = None
    human_score: Optional[int] = None
    override_comment: Optional[str] = None
    is_confirmed: bool = False

    class Config:
        from_attributes = True


# ─── Text Annotation ─────────────────────────────────────────────────────────

class AnnotationCreate(BaseModel):
    selected_text: str
    note: str
    section_name: Optional[str] = None


class AnnotationResponse(AnnotationCreate):
    id: int
    application_id: int
    reviewer_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Grant Agreement ─────────────────────────────────────────────────────────

class TrancheCreate(BaseModel):
    label: str
    amount: float
    tranche_type: str
    trigger_condition: str


class GenerateAgreementRequest(BaseModel):
    special_conditions: Optional[str] = None
    disbursement_tranches: List[TrancheCreate] = []


class GrantAgreementResponse(BaseModel):
    id: int
    application_id: int
    grant_reference: str
    agreement_text: str
    special_conditions: Optional[str] = None
    generated_by: int
    generated_at: datetime
    sent_at: Optional[datetime] = None
    acknowledged_at: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True


class DisbursementTrancheResponse(BaseModel):
    id: int
    application_id: int
    label: str
    amount: float
    tranche_type: str
    trigger_condition: str
    status: str
    disbursed_at: Optional[datetime] = None
    disbursed_by: Optional[int] = None

    class Config:
        from_attributes = True


class DisburseRequest(BaseModel):
    notes: Optional[str] = None


# ─── Decision ────────────────────────────────────────────────────────────────

class DecisionRequest(BaseModel):
    decision: str  # approved, rejected, waitlisted
    reason: str


# ─── Bank Details ────────────────────────────────────────────────────────────

class BankDetailsCreate(BaseModel):
    account_number: str
    ifsc_code: str
    beneficiary_name: str
    bank_name: Optional[str] = None


class BankDetailsResponse(BankDetailsCreate):
    id: int
    application_id: int
    added_by: int
    added_at: datetime

    class Config:
        from_attributes = True


# ─── Report ──────────────────────────────────────────────────────────────────

class ReportCreate(BaseModel):
    report_type: str
    period_label: Optional[str] = None
    due_date: Optional[datetime] = None
    activities_completed: Optional[str] = None
    activities_not_completed: Optional[str] = None
    activities_next_period: Optional[str] = None
    beneficiaries_reached: Optional[int] = None
    beneficiaries_male: Optional[int] = None
    beneficiaries_female: Optional[int] = None
    beneficiaries_other: Optional[int] = None
    outcomes_progress: Optional[str] = None
    key_challenges: Optional[str] = None
    expenditure_period: Optional[float] = None
    expenditure_cumulative: Optional[float] = None
    expenditure_by_line: Optional[str] = None
    variance_explanation: Optional[str] = None
    plans_next_period: Optional[str] = None
    support_needed: Optional[str] = None
    overall_achievement: Optional[str] = None
    final_beneficiaries: Optional[int] = None
    key_outcomes_achieved: Optional[str] = None
    lessons_learned: Optional[str] = None
    sustainability_plan: Optional[str] = None
    final_financial_statement: Optional[str] = None


class ReportResponse(BaseModel):
    id: int
    application_id: int
    report_type: str
    period_label: Optional[str] = None
    due_date: Optional[datetime] = None
    submitted_at: Optional[datetime] = None
    status: str
    activities_completed: Optional[str] = None
    activities_not_completed: Optional[str] = None
    activities_next_period: Optional[str] = None
    beneficiaries_reached: Optional[int] = None
    beneficiaries_male: Optional[int] = None
    beneficiaries_female: Optional[int] = None
    beneficiaries_other: Optional[int] = None
    outcomes_progress: Optional[str] = None
    key_challenges: Optional[str] = None
    expenditure_period: Optional[float] = None
    expenditure_cumulative: Optional[float] = None
    expenditure_by_line: Optional[str] = None
    variance_explanation: Optional[str] = None
    plans_next_period: Optional[str] = None
    support_needed: Optional[str] = None
    overall_achievement: Optional[str] = None
    final_beneficiaries: Optional[int] = None
    key_outcomes_achieved: Optional[str] = None
    lessons_learned: Optional[str] = None
    final_financial_statement: Optional[str] = None
    compliance_analysis: Optional[str] = None
    compliance_rating: Optional[str] = None
    po_action: Optional[str] = None
    po_action_reason: Optional[str] = None
    compliance_severity: Optional[str] = None
    reviewed_by: Optional[int] = None
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ReportReviewRequest(BaseModel):
    action: str  # approved, clarification_requested, compliance_action
    reason: str
    severity: Optional[str] = None  # warning, disbursement_hold


# ─── Expenditure ─────────────────────────────────────────────────────────────

class ExpenditureCreate(BaseModel):
    date: str
    payee: str
    amount: float
    budget_category: str
    description: str


class ExpenditureResponse(ExpenditureCreate):
    id: int
    application_id: int
    report_id: Optional[int] = None
    receipt_path: Optional[str] = None
    status: str
    submitted_by: int
    verified_by: Optional[int] = None
    submitted_at: datetime

    class Config:
        from_attributes = True


class ExpenditureStatusUpdate(BaseModel):
    status: str  # verified, queried


# ─── Message ─────────────────────────────────────────────────────────────────

class MessageCreate(BaseModel):
    content: str
    is_internal: bool = False


class MessageResponse(BaseModel):
    id: int
    application_id: int
    sender_id: int
    content: str
    is_internal: bool
    parent_id: Optional[int] = None
    created_at: datetime
    is_read: bool

    class Config:
        from_attributes = True


# ─── Notification ────────────────────────────────────────────────────────────

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    event_type: str
    title: str
    content: str
    application_id: Optional[int] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Audit Log ───────────────────────────────────────────────────────────────

class AuditLogResponse(BaseModel):
    id: int
    actor_id: Optional[int] = None
    actor_email: Optional[str] = None
    action: str
    object_type: str
    object_id: Optional[int] = None
    detail: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True


# ─── Admin ───────────────────────────────────────────────────────────────────

class CreateStaffRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str  # reviewer, officer, finance


class UpdateUserRequest(BaseModel):
    is_active: Optional[bool] = None
    role: Optional[str] = None


# ─── Eligibility Check ───────────────────────────────────────────────────────

class EligibilityCheckRequest(BaseModel):
    org_type: str
    district: str
    state: str
    amount_requested: float
    grant_type: str
    project_start: str
    project_end: str
    established_year: Optional[int] = None
    budget_overheads: Optional[float] = None


class EligibilityCheckResponse(BaseModel):
    eligible: bool
    reasons: List[str]
    programme: str
