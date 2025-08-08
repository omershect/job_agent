from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os
from fastapi import Request
from pydantic import BaseModel

app = FastAPI()

# ✅ Allow React frontend on localhost:5173
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Or ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/jobs")
def get_jobs():
    db_path = os.path.join(os.path.dirname(__file__), "..", "data", "jobs.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # cursor.execute("SELECT id, title, company, location, url, date_applied FROM jobs") - Old before addding the status
    # Include the status column so the frontend can reflect the latest
    # application stage stored in the database
    cursor.execute(
        "SELECT id, title, company, location, url, date_applied, status,comment FROM jobs"
    )
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row[0],
            "title": row[1],
            "company": row[2],
            "location": row[3],
            "url": row[4],
            "date_applied": row[5],
            "status": row[6],
            "comment": row[7]
            
        }
        for row in rows
    ]






class JobUpdate(BaseModel):
    status: str | None = None
    comment: str | None = None
    # id not required here

@app.put("/api/jobs/{job_id}")
def update_job(job_id: str, payload: JobUpdate):
    if not job_id or job_id in ("null", "undefined"):
        raise HTTPException(status_code=400, detail="Invalid job_id")

    fields, values = [], []
    if payload.status is not None:
        fields.append("status = ?")
        values.append(payload.status)
    if payload.comment is not None:
        fields.append("comment = ?")
        values.append(payload.comment)

    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    db_path = os.path.join(os.path.dirname(__file__), "..", "data", "jobs.db")
    with sqlite3.connect(db_path) as conn:
        cur = conn.cursor()
        cur.execute(f"UPDATE jobs SET {', '.join(fields)} WHERE id = ?", [*values, job_id])
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Job not found")
        conn.commit()
    return {"ok": True}



class JobCreate(BaseModel):
    id: str | None = None
    title: str
    company: str
    location: str | None = None
    url: str | None = None
    date_applied: str | None = None
    status: str | None = "new"
    comment: str | None = ""

@app.post("/api/jobs")
def add_job(job: JobCreate):
    job_id = payload.id or uuid4().hex  #  generate when missing
    db_path = os.path.join(os.path.dirname(__file__), "..", "data", "jobs.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO jobs (id,title, company, location, url, date_applied, status, comment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (job.title, job.company, job.location, job.url, job.date_applied, job.status, job.comment))
    conn.commit()
    conn.close()
    return {"message": "Job added"}