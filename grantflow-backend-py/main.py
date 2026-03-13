from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

import database, models
import auth_routes
# New module routers
from routers import programmes, applicant, screening, review, award, reporting, comms, admin

# Create all database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="GrantFlow API",
    description="Intelligent Grant Lifecycle Management Platform — ARGUS Hackathon 2026",
    version="2.0.0"
)

# CORS for React frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and serve static files
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ─── Routes ──────────────────────────────────────────────────────────────────

# Auth
app.include_router(auth_routes.router, prefix="/api/v1")

# Module 1 — Programmes & Eligibility
app.include_router(programmes.router, prefix="/api/v1")

# Module 2 — Applicant Portal
app.include_router(applicant.router, prefix="/api/v1")

# Module 3 — AI Screening
app.include_router(screening.router, prefix="/api/v1")

# Module 4 — Expert Review
app.include_router(review.router, prefix="/api/v1")

# Module 5 — Award & Disbursement
app.include_router(award.router, prefix="/api/v1")

# Module 6 — Reporting & Compliance
app.include_router(reporting.router, prefix="/api/v1")

# Module 7 — Communications
app.include_router(comms.router, prefix="/api/v1")

# Module 8 — Administration
app.include_router(admin.router, prefix="/api/v1")


@app.get("/api/v1/health")
def health():
    return {"status": "ok", "version": "2.0.0", "service": "GrantFlow API"}
