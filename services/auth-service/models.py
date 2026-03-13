import enum
from sqlalchemy import Column, Integer, String, Boolean, Enum
from database import Base


class RoleEnum(str, enum.Enum):
    applicant = "applicant"
    reviewer = "reviewer"
    officer = "officer"
    finance = "finance"
    admin = "admin"


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "auth"}

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=True)
    org_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    google_id = Column(String, unique=True, index=True, nullable=True)
    role = Column(Enum(RoleEnum, schema="auth"), default=RoleEnum.applicant)
    is_active = Column(Boolean, default=True)
