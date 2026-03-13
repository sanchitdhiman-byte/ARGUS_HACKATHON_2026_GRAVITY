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
