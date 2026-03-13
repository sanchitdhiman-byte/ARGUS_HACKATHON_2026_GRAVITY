from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database, models, routes

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="GrantFlow Auth Service",
    description="Authentication & user management for GrantFlow",
    version="1.0.0",
    root_path="/api/v1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api/v1")


@app.get("/api/v1/auth/health")
def health():
    return {"status": "ok", "service": "auth-service"}
