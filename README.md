# PSS (Patient Support System)

Full-stack lab report management app with a FastAPI backend and React + Vite frontend.

## Setup Steps

### 1) Clone and move into the repo

```bash
git clone <your-repo-url>
cd PSS
```

### 2) Backend setup (FastAPI)

```bash
cd backend/fastapi
python -m venv .venv
```

On Windows (PowerShell):

```powershell
(Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned) ; (.\.venv\Scripts\Activate.ps1)
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3) Frontend setup (React + Vite)

```bash
cd ../../frontend/pss
npm install
```

## Environment Variables

Create a `.env` file in `backend/fastapi`:

```env
APP_NAME=PSS Lab Report API
APP_VERSION=1.0.0
DATABASE_URL=sqlite:///./pss_lab.db
UPLOADS_DIR=uploads
ALLOWED_ORIGINS=http://localhost:5173
```

Create a `.env` file in `frontend/pss`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## How To Run Locally

### Start backend

From `backend/fastapi`:

```bash
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`.

### Start frontend

From `frontend/pss`:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Optional: Run tests

From `backend/fastapi`:

```bash
pytest
```

## AI Usage Log

| Date (YYYY-MM-DD) | Tool/Model | Usage Summary |
| --- | --- | --- |
| 2026-04-22 | GitHub Copilot (GPT-5.3-Codex) | Created root README with setup, env vars, and local run instructions. |
