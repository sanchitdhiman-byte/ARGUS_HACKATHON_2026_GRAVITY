from sqlalchemy import Column, Integer, String, Float, Text, Enum, ForeignKey, DateTime
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
    under_review = "under_review"
    risk_flagged = "risk_flagged"
    approved = "approved"
    active_reporting = "active_reporting"
    closed = "closed"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    org_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    google_id = Column(String, unique=True, index=True, nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.applicant)

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String, unique=True, index=True)
    applicant_id = Column(Integer, ForeignKey("users.id"))
    programme = Column(String)
    title = Column(String)
    duration_months = Column(Integer)
    state_region = Column(String)
    problem_stmt = Column(Text)
    solution = Column(Text)
    requested_amount = Column(Float)
    beneficiary_count = Column(Integer)
    status = Column(Enum(ApplicationStatusEnum), default=ApplicationStatusEnum.screening)
    submitted_date = Column(DateTime, default=datetime.utcnow)
    ai_score_alignment = Column(Integer, default=0)
    ai_score_feasibility = Column(Integer, default=0)
    ai_score_impact = Column(Integer, default=0)
    ai_summary = Column(Text, nullable=True)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    score_alignment = Column(Integer)
    score_feasibility = Column(Integer)
    score_impact = Column(Integer)
    comments = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
