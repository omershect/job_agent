import React, { useEffect, useState } from "react";
import "./App.css";
import EditModal from "./EditModal";
import EditIcon from "./EditIcon";
import AddModal from "./AddModal";

function App() {
  const [jobs, setJobs] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // --- API: GET jobs ---
  async function fetchJobs() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/jobs");
      if (!res.ok) throw new Error(`GET /api/jobs failed (${res.status})`);
      const data = await res.json();

      // דיבאג: לבדוק מה באמת חוזר מהשרת
      if (Array.isArray(data) && data.length > 0) {
        console.log("sample row from API:", data[0]);
      }

      // מיון לפי תאריך הגשה (אם חסר תאריך – דוחפים לסוף)
      const sorted = [...data].sort((a, b) => {
        const da = a?.date_applied ? new Date(a.date_applied) : 0;
        const db = b?.date_applied ? new Date(b.date_applied) : 0;
        return db - da;
      });

      setJobs(sorted);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  // --- Open edit modal ---
  function handleEdit(job) {
    if (!job?.id) {
      console.warn("handleEdit: job without id", job);
      return;
    }
    setEditingJob(job);
  }

  function handleClosePanel() {
    setEditingJob(null);
  }

  // --- Save from modal (PUT) ---
  async function handleSave(updatedJob) {
    // אם המודל לא שלח id, ניקח מה-state
    const id = updatedJob?.id ?? editingJob?.id;
    if (!id) {
      console.error("handleSave: missing job id", { updatedJob, editingJob });
      alert("Can't save: missing job id");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/jobs/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // לרוב ה־API מצפה רק לשדות לעדכון:
          body: JSON.stringify({
            status: updatedJob.status ?? null,
            comment: updatedJob.comment ?? null,
          }),
        }
      );

      if (!res.ok) {
        let detail;
        try {
          detail = await res.json();
        } catch {
          detail = await res.text();
        }
        throw new Error(
          `Update failed (${res.status}): ${
            typeof detail === "string" ? detail : JSON.stringify(detail)
          }`
        );
      }

      setEditingJob(null);
      await fetchJobs();
    } catch (err) {
      console.error("Error updating job:", err);
      alert(err.message || "Update failed");
    }
  }

  // --- Add new job (POST) ---
  async function handleAdd(job) {
    try {
      const res = await fetch("http://localhost:8000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
      if (!res.ok) throw new Error(`Failed to add job (${res.status})`);
      await res.json();
      setShowAddModal(false);
      await fetchJobs();
    } catch (err) {
      console.error("Add job failed:", err);
      alert(err.message || "Add failed");
    }
  }

  return (
    <>
      <div className="page-container">
        <div className="sticky-header">
          <h1 className="main-title">המשרות שלי</h1>
          <button
            className={`refresh-button ${loading ? "loading" : ""}`}
            onClick={fetchJobs}
            disabled={loading}
          >
            {loading ? "מרענן..." : "🔄 רענן נתונים"}
          </button>
          {lastUpdated && (
            <>
              <div className="last-updated">
                עדכון אחרון: {lastUpdated.toLocaleString()}
              </div>
              <button
                className="add-button"
                onClick={() => setShowAddModal(true)}
              >
                ➕ הוסף משרה חדשה
              </button>
            </>
          )}
        </div>

        {/* Header */}
        <div className="kanban-row header">
          <div>#</div>
          <div>משרה</div>
          <div>תאריך הגשה</div>
          <div>סטאטוס</div>
          <div>הערות</div>
          <div>פעולות</div> {/* הוספתי כותרת לעמודת העריכה ליישור */}
        </div>

        {/* Rows */}
        {jobs.length === 0 && (
          <div className="kanban-row">
            <div className="kanban-cell" style={{ gridColumn: "1 / -1" }}>
              אין משרות בשלב זה
            </div>
          </div>
        )}

        {jobs.map((job, i) => (
          <div
            className="kanban-row"
            key={job.id || `${job.title}-${job.company}-${i}`}
          >
            <div>{i + 1}</div>
            <div>
              <strong>{job.title}</strong>
              <br />
              {job.company}
              <br />
              {job.url ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  לצפייה
                </a>
              ) : (
                "—"
              )}
            </div>
            <div>
              {job.date_applied
                ? new Date(job.date_applied).toLocaleDateString()
                : "—"}
            </div>
            <div>{job.status || "—"}</div>
            <div>{job.comment || "—"}</div>
            <div>
              <button
                onClick={() => handleEdit(job)}
                className="edit-button"
                disabled={!job?.id} // לא לאפשר עריכה בלי מזהה
                title={
                  !job?.id
                    ? "אין מזהה למשרה הזו (id). לא ניתן לערוך."
                    : "עריכה"
                }
              >
                <EditIcon size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingJob && (
        <EditModal
          job={editingJob}
          onClose={handleClosePanel}
          onSave={handleSave}
        />
      )}

      {showAddModal && (
        <AddModal onClose={() => setShowAddModal(false)} onSave={handleAdd} />
      )}
    </>
  );
}

export default App;
