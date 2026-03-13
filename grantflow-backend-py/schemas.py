from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from models import RoleEnum, ApplicationStatusEnum
from datetime import datetime

class UserBase(BaseModel):
    org_name: str
    email: EmailStr
    role: RoleEnum

class UserCreate(UserBase):
    password: Optional[str] = None
    google_id: Optional[str] = None

class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True

# We want to match the frontend's JSON Payload structure as best as possible
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
    requested_amount: float
    submitted_at: datetime
    ai_score: int
    ai_summary: Optional[str] = None

    class Config:
        from_attributes = True

class ApplicationDetailResponse(ApplicationResponse):
    # Expand to all fields for the detailed view
    reg_number: Optional[str] = None
    entity_type: Optional[str] = None
    project_title: Optional[str] = None
    problem_statement: Optional[str] = None
    proposed_solution: Optional[str] = None
    
    class Config:
        from_attributes = True

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
