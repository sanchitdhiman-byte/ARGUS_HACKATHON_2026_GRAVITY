from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, models, schemas
from auth_verify import get_current_user, CurrentUser

router = APIRouter(tags=["profile"])


@router.get("/profile", response_model=schemas.OrgProfileResponse)
def get_profile(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(database.get_db)):
    profile = db.query(models.OrganisationProfile).filter(models.OrganisationProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.post("/profile", response_model=schemas.OrgProfileResponse)
def upsert_profile(data: schemas.OrgProfileCreate, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(database.get_db)):
    profile = db.query(models.OrganisationProfile).filter(models.OrganisationProfile.user_id == current_user.id).first()
    if profile:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(profile, field, value)
    else:
        profile = models.OrganisationProfile(user_id=current_user.id, **data.model_dump())
        db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
