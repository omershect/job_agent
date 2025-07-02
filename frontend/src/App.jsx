

import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  //const columns = ['#', 'הוגשה מועמדות', 'ראיון', 'נשמר', 'הצעה'];
  const columns = [  'ראיון', 'סטאטוס', 'תאריך הגשה', 'הצעות','#'];
  
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        
                
        //const sorted = data.sort((a, b) => new Date(b.posted) - new Date(a.posted));


        const sorted = data.sort((a, b) => {
            const dateA = new Date(a.posted);
            const dateB = new Date(b.posted);

            const isValidA = !isNaN(dateA);
            const isValidB = !isNaN(dateB);

            if (isValidA && isValidB) {
              return dateB - dateA; // newest first
            } else if (isValidA) {
              return -1; // a is valid, b is not → a before b
            } else if (isValidB) {
              return 1; // b is valid, a is not → b before a
            } else {
              return 0; // both invalid
            }
          });
        
        
        setJobs(sorted);
      })
      .catch((err) => console.error('Failed to fetch jobs:', err));
  }, []);





  return (
    <div className="page-container">
      <h1 className="main-title">המשרות שלי</h1>
      <div className="kanban-container">
        {columns.map((title, colIndex) => (
          <div key={title} className="kanban-column">
            <div className="kanban-header">{title}</div>
            <div className="kanban-cards">
              {colIndex === 4 ? (
                jobs.map((_, i) => (
                  <div key={i} className="kanban-card row-style">
                    {i + 1}
                  </div>
                ))
              ) : colIndex === 3 ? (
                jobs.map((job, i) => (
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
               

              ) 
                        
              : colIndex === 2 ? (
                jobs.map((job, i) => (
                  <div key={job.id} className="kanban-card row-style">
                  
                   
                    <div>{new Date(job.posted).toLocaleDateString()}</div>
                  
                    </div>
                 
                ))

                            
            ): (
                <div className="kanban-card row-style">אין משרות בשלב זה</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;



