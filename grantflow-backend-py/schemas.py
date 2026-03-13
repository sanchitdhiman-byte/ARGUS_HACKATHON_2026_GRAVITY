from pydantic import BaseModel, EmailStr
from typing import Optional, List
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

class ApplicationBase(BaseModel):
    programme: str
    title: str
    duration_months: int
    state_region: str
    problem_stmt: str
    solution: str
    requested_amount: float
    beneficiary_count: int

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationResponse(ApplicationBase):
    id: int
    reference_id: str
    applicant_id: int
    status: ApplicationStatusEnum
    submitted_date: datetime
    ai_score_alignment: int
    ai_score_feasibility: int
    ai_score_impact: int
    ai_summary: Optional[str] = None
    
    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    application_id: int
    score_alignment: int
    score_feasibility: int
    score_impact: int
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
