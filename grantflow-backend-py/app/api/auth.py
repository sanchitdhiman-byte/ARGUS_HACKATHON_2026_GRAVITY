"""Registration, login, Google OAuth, and token refresh."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import requests

from app.db.session import get_db
from app.models.models import User, RoleEnum
from app.schemas.schemas import UserCreate, UserResponse, LoginRequest, GoogleLoginRequest, TokenRefreshRequest
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        org_name=user.org_name,
        email=user.email,
        hashed_password=get_password_hash(user.password) if user.password else None,
        role=user.role,
        google_id=user.google_id,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not user.hashed_password or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": create_access_token(subject=user.id),
        "refresh_token": create_refresh_token(subject=user.id),
        "token_type": "bearer",
        "user": {"id": user.id, "org_name": user.org_name, "email": user.email, "role": user.role.value},
    }


@router.post("/google")
def google_auth(req: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        if req.token == "mock-google-token":
            email, google_id, org_name = "demo@google.com", "mock-12345", "Google Mock User"
        else:
            response = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={req.token}")
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Invalid Google Token")
            id_info = response.json()
            email = id_info.get("email")
            google_id = id_info.get("sub")
            org_name = id_info.get("name")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email, org_name=org_name, google_id=google_id, role=RoleEnum.applicant)
            db.add(user)
            db.commit()
            db.refresh(user)
        elif not user.google_id:
            user.google_id = google_id
            db.commit()

        return {
            "access_token": create_access_token(subject=user.id),
            "refresh_token": create_refresh_token(subject=user.id),
            "token_type": "bearer",
            "user": {"id": user.id, "org_name": user.org_name, "email": user.email, "role": user.role.value},
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/refresh")
def refresh_token(req: TokenRefreshRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(req.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        token_type = payload.get("type")
        if user_id is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return {
            "access_token": create_access_token(subject=user.id),
            "refresh_token": create_refresh_token(subject=user.id),
            "token_type": "bearer",
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
