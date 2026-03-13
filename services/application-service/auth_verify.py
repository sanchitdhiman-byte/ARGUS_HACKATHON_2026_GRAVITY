"""Stateless JWT verification — no DB lookup."""
import os
from dataclasses import dataclass
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "grantflow-super-secret-key-for-hackathon")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


@dataclass
class CurrentUser:
    id: int
    email: str
    role: str
    is_active: bool = True


def get_current_user(token: str = Depends(oauth2_scheme)) -> CurrentUser:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id or payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token")
        return CurrentUser(id=int(user_id), email=payload.get("email", ""), role=payload.get("role", "applicant"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")


def require_roles(*roles: str):
    def checker(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail=f"Requires role: {list(roles)}")
        return current_user
    return checker
