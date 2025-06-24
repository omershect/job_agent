import sqlite3

db_path = "E:/job_agent/data/jobs.db"

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check if table exists
    print("Tables:")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print(cursor.fetchall())

    # Show 5 rows from the jobs table
    print("\nSample rows from 'jobs' table:")
    cursor.execute("SELECT * FROM jobs LIMIT 5;")
    rows = cursor.fetchall()

    for row in rows:
        print(row)

except sqlite3.Error as e:
    print("Database error:", e)

finally:
    if conn:
        conn.close()
