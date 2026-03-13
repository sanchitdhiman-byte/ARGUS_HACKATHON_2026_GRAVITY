from pydantic import BaseModel, EmailStr
from typing import Optional
from models import RoleEnum


class UserCreate(BaseModel):
    org_name: str
    email: EmailStr
    role: RoleEnum = RoleEnum.applicant
    password: Optional[str] = None
    google_id: Optional[str] = None
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    full_name: Optional[str] = None
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


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class CreateStaffRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str
