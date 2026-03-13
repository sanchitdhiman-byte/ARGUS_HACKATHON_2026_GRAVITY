@echo off
echo ===================================================
echo Starting GrantFlow Full Project Integration
echo ===================================================

echo [1/2] Starting Frontend App...
start "GrantFlow Frontend" cmd /k "cd grantflow-frontend && npm install && npm run dev"

echo [2/2] Starting FastAPI Backend with SQLite Database...
start "GrantFlow Backend" cmd /k "cd grantflow-backend && if not exist venv (python -m venv venv) && venv\Scripts\activate.bat && pip install uvicorn fastapi sqlalchemy pydantic passlib[bcrypt] python-jose[cryptography] email-validator python-multipart requests && uvicorn main:app --reload --port 8000"

echo Environment launched successfully in separate terminal windows.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000/docs
