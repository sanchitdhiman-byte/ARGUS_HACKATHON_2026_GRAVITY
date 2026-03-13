from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

from app.models.models import RoleEnum, ApplicationStatusEnum


# ── Auth ───────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    org_name: str
    email: EmailStr
    role: RoleEnum = RoleEnum.applicant
    password: Optional[str] = None
    google_id: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    org_name: str
    email: str
    role: RoleEnum
    is_active: bool = True

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str


class GoogleLoginRequest(BaseModel):
    token: str


class TokenRefreshRequest(BaseModel):
    refresh_token: str


# ── Applications ───────────────────────────────────────────────────────

class ApplicationCreate(BaseModel):
    grantType: str
    formData: Dict[str, Any]


class ApplicationResponse(BaseModel):
    id: int
    reference_id: str
    applicant_id: int
    status: ApplicationStatusEnum
    grant_type: str
    org_name: Optional[str] = None
    total_requested: Optional[float] = None
    submitted_at: Optional[datetime] = None
    ai_score: int = 0
    ai_summary: Optional[str] = None
    project_title: Optional[str] = None

    class Config:
        from_attributes = True


class ApplicationDetailResponse(ApplicationResponse):
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
    project_location: Optional[str] = None
    target_beneficiaries: Optional[int] = None
    problem_statement: Optional[str] = None
    proposed_solution: Optional[str] = None
    sustainability_plan: Optional[str] = None
    schools_targeted: Optional[int] = None
    grade_coverage: Optional[str] = None
    budget_personnel: Optional[float] = None
    budget_equipment: Optional[float] = None
    budget_travel: Optional[float] = None
    budget_overheads: Optional[float] = None
    budget_other: Optional[float] = None
    budget_justification: Optional[str] = None
    prior_projects: Optional[str] = None
    has_previous_grants: bool = False
    prior_funder: Optional[str] = None
    prior_amount: Optional[float] = None
    signatory_name: Optional[str] = None
    designation: Optional[str] = None
    submission_date: Optional[str] = None
    declared: bool = False
    screening_report: Optional[Dict[str, Any]] = None
    ai_review_package: Optional[Dict[str, Any]] = None
    ai_score_alignment: int = 0
    ai_score_feasibility: int = 0
    ai_score_impact: int = 0

    class Config:
        from_attributes = True


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatusEnum
    reason: Optional[str] = None


# ── Reviews ────────────────────────────────────────────────────────────

class ReviewCreate(BaseModel):
    application_id: int
    score_alignment: int
    score_feasibility: int
    score_impact: int
    score_budget: Optional[int] = 0
    score_track_record: Optional[int] = 0
    comments: str
    ai_overrides: Optional[Dict[str, Any]] = None


class ReviewResponse(BaseModel):
    id: int
    application_id: int
    reviewer_id: int
    score_alignment: Optional[int] = None
    score_feasibility: Optional[int] = None
    score_impact: Optional[int] = None
    score_budget: Optional[int] = None
    score_track_record: Optional[int] = None
    total_score: Optional[int] = None
    comments: Optional[str] = None
    ai_overrides: Optional[Dict[str, Any]] = None
    status: str = "in_progress"
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewerAssignment(BaseModel):
    reviewer_id: int


# ── Compliance ─────────────────────────────────────────────────────────

class ComplianceReportCreate(BaseModel):
    application_id: int
    report_type: str
    report_data: Dict[str, Any]


class ComplianceReportResponse(BaseModel):
    id: int
    application_id: int
    report_type: str
    due_date: Optional[datetime] = None
    submitted_date: Optional[datetime] = None
    status: str
    report_data: Optional[Dict[str, Any]] = None
    ai_analysis: Optional[Dict[str, Any]] = None
    officer_comments: Optional[str] = None

    class Config:
        from_attributes = True


class ComplianceReviewAction(BaseModel):
    action: str  # approve, request_clarification, flag_compliance
    comments: Optional[str] = None
    severity: Optional[str] = None  # warning, disbursement_hold


# ── Disbursements ──────────────────────────────────────────────────────

class DisbursementCreate(BaseModel):
    application_id: int
    amount: float
    tranche_name: str
    trigger_condition: Optional[str] = None


class DisbursementResponse(BaseModel):
    id: int
    application_id: int
    amount: float
    tranche_name: str
    trigger_condition: Optional[str] = None
    status: str
    scheduled_date: Optional[datetime] = None
    disbursed_date: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Notifications ──────────────────────────────────────────────────────

class NotificationResponse(BaseModel):
    id: int
    notification_type: str
    title: str
    message: str
    is_read: bool
    reference_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Messages ───────────────────────────────────────────────────────────

class MessageCreate(BaseModel):
    application_id: int
    content: str
    is_internal_note: bool = False


class MessageResponse(BaseModel):
    id: int
    application_id: int
    sender_id: int
    content: str
    is_internal_note: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Screening ──────────────────────────────────────────────────────────

class ScreeningOverride(BaseModel):
    action: str  # confirm_eligible, override_ineligible, request_clarification
    reason: Optional[str] = None
    clarification_question: Optional[str] = None


# ── Eligibility Pre-Check ─────────────────────────────────────────────

class EligibilityPreCheck(BaseModel):
    organisation_type: str
    project_district: str
    funding_amount: float


# ── Admin / RBAC ──────────────────────────────────────────────────────

class RoleUpdateRequest(BaseModel):
    role: RoleEnum


class StaffAssignmentRequest(BaseModel):
    staff_id: int
    role: Optional[str] = None  # officer or reviewer — context hint
    force: bool = False  # bypass conflict-of-interest warning
