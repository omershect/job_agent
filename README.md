# Job-Agent Dashboard

A personal job tracking dashboard with a Kanban-style interface.  
Built using React for the frontend and Python (FastAPI or Flask) for the backend.

## Features

- Add and track job applications through multiple stages
- Filter and search jobs by company or title
- Import jobs from Excel
- Score and recommend jobs (coming soon using AI)
- Responsive UI with modern styling

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py


job_agent/
│
├── backend/
│   ├── main.py
│   ├── db.py
│   ├── import_jobs.py
│   └── data/
│       └── jobs.db
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── ...
│   └── public/
