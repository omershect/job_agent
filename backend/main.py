from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

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
        "SELECT id, title, company, location, url, date_applied, status FROM jobs"
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
           # "comment": row[7]
            
        }
        for row in rows
    ]