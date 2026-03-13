from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database, models, routers, auth_routes, admin_routes

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

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
