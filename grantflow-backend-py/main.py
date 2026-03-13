from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import database, models, routers, auth_routes, admin_routes

# Create database tables
models.Base.metadata.create_all(bind=database.engine)


def _seed_grants():
    """Seed CDG / EIG / ECAG grant programmes if table is empty."""
    db = database.SessionLocal()
    try:
        if db.query(models.GrantProgram).count() > 0:
            return
        seed = [
            models.GrantProgram(
                code="CDG", short_title="CDG",
                title="Community Development Grant (CDG)",
                purpose="Fund community-level infrastructure and social service projects",
                description="Supporting grassroots organizations to build community-level infrastructure and deliver social service projects in rural and semi-urban India. Ideal for registered NGOs, Trusts, and Section 8 Companies.",
                funding_min=200000, funding_max=2000000,
                funding_range="₹2,00,000 – ₹20,00,000",
                duration_min=6, duration_max=18,
                eligible_types=json.dumps(["NGO", "Trust", "Section 8 Company"]),
                min_years=2, deadline="June 30, 2026",
                geographic_focus="Rural and semi-urban areas in India",
                total_budget="₹2 Crore per cycle", max_awards=10,
            ),
            models.GrantProgram(
                code="EIG", short_title="EIG",
                title="Education Innovation Grant (EIG)",
                purpose="Fund technology-enabled or pedagogy-innovation projects improving learning outcomes in government schools",
                description="Funding for projects that leverage technology or innovative pedagogy to improve learning outcomes in government schools. Open to NGOs, EdTech non-profits, research institutions, and universities.",
                funding_min=500000, funding_max=5000000,
                funding_range="₹5,00,000 – ₹50,00,000",
                duration_min=12, duration_max=24,
                eligible_types=json.dumps(["NGO", "EdTech Non-profit", "Research Institution", "University"]),
                min_years=1, deadline="Rolling (Quarterly)",
                geographic_focus="Any state in India; preference for aspirational districts",
                total_budget="₹5 Crore per year", max_awards=5,
            ),
            models.GrantProgram(
                code="ECAG", short_title="ECAG",
                title="Environment & Climate Action Grant (ECAG)",
                purpose="Fund grassroots environmental conservation, climate resilience, and clean energy access projects",
                description="Empowering grassroots movements to combat climate change through direct conservation action, climate resilience building, and clean energy access initiatives across climate-vulnerable regions.",
                funding_min=300000, funding_max=3000000,
                funding_range="₹3,00,000 – ₹30,00,000",
                duration_min=6, duration_max=24,
                eligible_types=json.dumps(["NGO", "FPO", "Panchayat", "Research Institution"]),
                min_years=0, deadline="Aug 31, 2026",
                geographic_focus="India — priority given to climate-vulnerable districts",
                total_budget="₹3 Crore per year", max_awards=15,
            ),
        ]
        for g in seed:
            db.add(g)
        db.commit()
        print("✅ Seeded CDG / EIG / ECAG grant programmes.")
    finally:
        db.close()


_seed_grants()

app = FastAPI(
    title="GrantFlow API",
    description="Intelligent Grant Lifecycle Management Platform Backend",
    version="1.0.0"
)

# Standard CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(auth_routes.router, prefix="/api/v1")
app.include_router(routers.router, prefix="/api/v1")
app.include_router(admin_routes.router, prefix="/api/v1")

@app.get("/api/v1/health")
def read_root():
    return {"status": "ok", "message": "GrantFlow Agentic AI Backend is fully operational."}
