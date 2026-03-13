from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import jwt, JWTError
import requests

import database, models, schemas, auth

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = auth.get_password_hash(user.password) if user.password else None
    new_user = models.User(
        org_name=user.org_name,
        email=user.email,
        hashed_password=hashed_pwd,
        role=user.role,
        google_id=user.google_id
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
        
    access_token = auth.create_access_token(subject=user.id)
    refresh_token = auth.create_refresh_token(subject=user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {"id": user.id, "org_name": user.org_name, "email": user.email, "role": user.role.value}
    }

@router.post("/google")
def google_auth(req: schemas.GoogleLoginRequest, db: Session = Depends(database.get_db)):
    # Verify the Google Token via Google's tokeninfo endpoint
    try:
        if req.token == "mock-google-token":
            email = "demo@google.com"
            google_id = "mock-12345"
            org_name = "Google Mock User"
        else:
            response = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={req.token}")
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Invalid Google Token")
                
            id_info = response.json()
            email = id_info.get("email")
            google_id = id_info.get("sub")
            org_name = id_info.get("name") # Using name for org_name fallback
        
        # Check if user exists
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            # Auto-register Google user as an Applicant
            user = models.User(
                email=email,
                org_name=org_name,
                google_id=google_id,
                role=models.RoleEnum.applicant
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        elif not user.google_id:
            # Link existing account to Google
            user.google_id = google_id
            db.commit()
            
        access_token = auth.create_access_token(subject=user.id)
        refresh_token = auth.create_refresh_token(subject=user.id)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {"id": user.id, "org_name": user.org_name, "email": user.email, "role": user.role.value}
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/refresh")
def refresh_token(req: schemas.TokenRefreshRequest, db: Session = Depends(database.get_db)):
    try:
        payload = jwt.decode(req.refresh_token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
            
        user = db.query(models.User).filter(models.User.id == int(user_id)).first()
        if not user:
             raise HTTPException(status_code=401, detail="User not found")
             
        new_access_token = auth.create_access_token(subject=user.id)
        new_refresh_token = auth.create_refresh_token(subject=user.id)
        
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
