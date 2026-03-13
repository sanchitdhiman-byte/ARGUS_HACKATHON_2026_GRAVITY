from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import engine
from app.models.models import Base
from app.api import auth, applications, reviews, compliance, chat, admin

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.PROJECT_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(auth.router, prefix="/api/v1")
app.include_router(applications.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(compliance.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")


@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "message": "GrantFlow Agentic AI Backend is fully operational."}


@app.get("/api/v1/grant-programmes")
def list_grant_programmes():
    """Public endpoint: list all available grant programmes."""
    from app.core.constants import GRANT_PROGRAMMES
    return [
        {
            "code": code,
            "name": prog["name"],
            "purpose": prog["purpose"],
            "funding_range": f"INR {prog['funding_min']:,} – {prog['funding_max']:,}",
            "duration": f"{prog['duration_min_months']}–{prog['duration_max_months']} months",
            "eligible_org_types": prog["eligible_org_types"],
        }
        for code, prog in GRANT_PROGRAMMES.items()
    ]


@app.get("/api/v1/programmes/metadata")
def get_all_programme_metadata():
    """Public endpoint: full form metadata for all grant types (drives dynamic form engine)."""
    from app.core.grant_metadata import GRANT_METADATA
    return GRANT_METADATA


@app.get("/api/v1/programmes/metadata/{grant_type}")
def get_programme_metadata(grant_type: str):
    """Public endpoint: form metadata for a specific grant type."""
    from app.core.grant_metadata import GRANT_METADATA
    gt = grant_type.upper()
    if gt not in GRANT_METADATA:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Grant type '{grant_type}' not found. Available: {list(GRANT_METADATA.keys())}")
    return GRANT_METADATA[gt]
