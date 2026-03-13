import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "GrantFlow API"
    PROJECT_VERSION: str = "1.0.0"
    PROJECT_DESCRIPTION: str = "Intelligent Grant Lifecycle Management Platform Backend"

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./grantflow.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "grantflow-super-secret-key-for-hackathon")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]


settings = Settings()
