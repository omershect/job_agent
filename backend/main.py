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
    cursor.execute("SELECT id, title, company, location, url, posted FROM jobs")
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row[0],
            "title": row[1],
            "company": row[2],
            "location": row[3],
            "url": row[4],
            "posted": row[5]
        }
        for row in rows
    ]
