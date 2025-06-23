from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    conn = sqlite3.connect('data/job_agent.db')  # Adjust path as needed
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, company, location, url, posted, status FROM jobs")
    rows = cursor.fetchall()
    conn.close()

    jobs = [
        {
            "id": row[0],
            "title": row[1],
            "company": row[2],
            "location": row[3],
            "url": row[4],
            "posted": row[5],
            "status": row[6]
        }
        for row in rows
    ]
    return jsonify(jobs)

if __name__ == '__main__':
    app.run(debug=True)
