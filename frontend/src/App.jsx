import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const columns = ['ראיון', 'סטאטוס', 'תאריך הגשה', 'הצעות', '#'];

  const [jobs, setJobs] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);

  function fetchJobs() {
  setLoading(true); // מתחיל טעינה
  fetch('http://localhost:8000/api/jobs')
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched jobs data:", data);
      data.forEach((job) => {
        console.log("date_applied:", job.date_applied);
      });

      const sorted = data.sort((a, b) => {
        const dateA = new Date(a.date_applied);
        const dateB = new Date(b.date_applied);
        const isValidA = !isNaN(dateA);
        const isValidB = !isNaN(dateB);
        if (isValidA && isValidB) {
          return dateB - dateA;
        } else if (isValidA) {
          return -1;
        } else if (isValidB) {
          return 1;
        } else {
          return 0;
        }
      });

      setJobs(sorted);
      setLastUpdated(new Date());
    })
    .catch((err) => console.error('Failed to fetch jobs:', err))
    .finally(() => {
      setLoading(false); // מסיים טעינה גם אם הייתה שגיאה
    });
}

  useEffect(() => {
    fetchJobs();
  }, []);



 

return (
  <div className="page-container">
    <div className="sticky-header">
      <h1 className="main-title">המשרות שלי</h1>
      <button
         className={`refresh-button ${loading ? "loading" : ""}`}
          onClick={fetchJobs}
             disabled={loading}>
              {loading ? "מרענן..." : "🔄 רענן נתונים"}
        </button>
      {lastUpdated && (
        <div className="last-updated">
          עדכון אחרון: {lastUpdated.toLocaleString()}
        </div>
      )}
      <div className="kanban-header-row">
        {columns.map((title) => (
          <div key={title} className="kanban-header">
            {title}
          </div>
        ))}
      </div>
    </div>

    <div className="kanban-container">
      {columns.map((title, colIndex) => (
        <div key={title} className="kanban-column">
          <div className="kanban-cards">
            {colIndex === 4 ? (
              jobs.map((_, i) => (
                <div key={i} className="kanban-card row-style">
                  {i + 1}
                </div>
              ))
            ) : colIndex === 3 ? (
              jobs.map((job) => (
                <div key={job.id} className="kanban-card row-style">
                  <div><strong>{job.title}</strong></div>
                  <div>{job.company}</div>
                  <div>
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      לצפייה
                    </a>
                  </div>
                </div>
              ))
            ) : colIndex === 2 ? (
              jobs.map((job) => (
                <div key={job.id} className="kanban-card row-style">
                  <div>{new Date(job.date_applied).toLocaleDateString()}</div>
                </div>
              ))
            ) : colIndex === 1 ? (
              jobs.map((job) => (
                <div key={job.id} className="kanban-card row-style">
                  {job.status}
                </div>
              ))
            ) : (
              <div className="kanban-card row-style">
                אין משרות בשלב זה
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

}

export default App;
