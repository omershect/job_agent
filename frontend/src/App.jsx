import React from 'react';
import './App.css';

function App() {
  const columns = ['נשמר', 'הוגשה מועמדות', 'ראיון', 'הצעה'];

  return (
    <div className="page-container">
      <h1 className="main-title">המשרות שלי</h1>
      <div className="kanban-container">
        {columns.map((title) => (
          <div key={title} className="kanban-column">
            <div className="kanban-header">{title}</div>
            <div className="kanban-cards">
              <div className="kanban-card">אין משרות בשלב זה</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
