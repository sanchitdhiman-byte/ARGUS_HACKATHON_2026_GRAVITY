from pydantic import BaseModel, model_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from models import ApplicationStatusEnum


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
        if hasattr(values, "__dict__"):
            if values.__dict__.get("requested_amount") is None:
                values.__dict__["requested_amount"] = getattr(values, "total_requested", 0.0) or 0.0
        elif isinstance(values, dict):
            if "requested_amount" not in values or values["requested_amount"] is None:
                values["requested_amount"] = values.get("total_requested", 0.0) or 0.0
        return values

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
    ai_review_package: Optional[str] = None
    decision_reason: Optional[str] = None
    decision_by: Optional[int] = None
    decision_at: Optional[datetime] = None
    project_type: Optional[str] = None
    beneficiary_demographics: Optional[str] = None
    key_activities: Optional[str] = None
    expected_outcomes: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None

    class Config:
        from_attributes = True


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
