import pandas as pd
import sqlite3
import os
import hashlib

os.chdir(r"E:\job_agent")




# Load the CSV
df = pd.read_csv("data/Imported_Jobs.csv")

# Rename columns to match DB schema
df.rename(columns={
    "link": "url",
    "date_applied": "posted"
}, inplace=True)

# Generate stable hash IDs from URL (or combine fields if URL is missing)
#df["id"] = df["url"].apply(lambda x: hashlib.sha256(x.encode()).hexdigest())
df["id"] = df["url"].fillna("").apply(lambda x: hashlib.sha256(x.encode()).hexdigest() if x else "")


# Add missing columns required by schema with default values
df["location"] = ""
df["jd"] = ""
df["match_score"] = 0.0
df["rationale"] = ""
df["recommendation"] = ""

# Reorder columns to match schema
columns = [
    "id", "title", "company", "location", "url", "posted", "jd",
    "match_score", "rationale", "recommendation"
]
df = df[columns]

# Connect to the database and insert records
conn = sqlite3.connect("job_agent.db")
df.to_sql("jobs", conn, if_exists="append", index=False)
conn.close()

print(f"✅ Imported {len(df)} rows successfully.")
