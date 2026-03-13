from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import requests

import database, models, schemas, auth

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/health")
def health():
    return {"status": "ok", "service": "auth-service"}


@router.post("/register", response_model=schemas.UserResponse, status_code=201)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pwd = auth.get_password_hash(user.password) if user.password else None
    new_user = models.User(
        org_name=user.org_name,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_pwd,
        role=user.role,
        google_id=user.google_id,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login")
def login(req: schemas.LoginRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user or not user.hashed_password or not auth.verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "access_token": auth.create_access_token(user),
        "refresh_token": auth.create_refresh_token(user),
        "token_type": "bearer",
        "user": {"id": user.id, "org_name": user.org_name, "email": user.email, "role": user.role.value},
    }


@router.post("/google")
def google_auth(req: schemas.GoogleLoginRequest, db: Session = Depends(database.get_db)):
    try:
        if req.token == "mock-google-token":
            email, google_id, org_name = "demo@google.com", "mock-12345", "Google Mock User"
        else:
            resp = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={req.token}", timeout=5)
            if resp.status_code != 200:
                raise HTTPException(status_code=400, detail="Invalid Google Token")
            info = resp.json()
            email = info.get("email")
            google_id = info.get("sub")
            org_name = info.get("name", "Google User")

        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            user = models.User(email=email, org_name=org_name, google_id=google_id, role=models.RoleEnum.applicant)
            db.add(user)
            db.commit()
            db.refresh(user)
        elif not user.google_id:
            user.google_id = google_id
            db.commit()

        return {
            "access_token": auth.create_access_token(user),
            "refresh_token": auth.create_refresh_token(user),
            "token_type": "bearer",
            "user": {"id": user.id, "org_name": user.org_name, "email": user.email, "role": user.role.value},
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/refresh")
def refresh_token(req: schemas.TokenRefreshRequest, db: Session = Depends(database.get_db)):
    try:
        payload = jwt.decode(req.refresh_token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        user_id = payload.get("sub")
        if not user_id or payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        user = db.query(models.User).filter(models.User.id == int(user_id)).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {
            "access_token": auth.create_access_token(user),
            "refresh_token": auth.create_refresh_token(user),
            "token_type": "bearer",
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


@router.post("/staff", response_model=schemas.UserResponse, status_code=201)
def create_staff(
    req: schemas.CreateStaffRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    if current_user.role != models.RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Admin only")
    if db.query(models.User).filter(models.User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        full_name=req.full_name,
        email=req.email,
        org_name=req.full_name,
        hashed_password=auth.get_password_hash(req.password),
        role=models.RoleEnum(req.role),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
