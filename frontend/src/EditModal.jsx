import React from "react";
import "./EditModal.css";

export default function EditModal({ job, onClose, onSave }) {
  const [status, setStatus] = React.useState(job?.status ?? "");
  const [comment, setComment] = React.useState(job?.comment ?? "");

  // Keep local state in sync if a different job is opened
  React.useEffect(() => {
    setStatus(job?.status ?? "");
    setComment(job?.comment ?? "");
  }, [job?.id]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!job?.id) {
      console.error("EditModal: missing job.id", job);
      return;
    }
    onSave({ id: job.id, status, comment });
  }

  const missingId = !job?.id;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✖️</button>
        <h2>עריכת משרה</h2>

        {missingId && (
          <div className="warning">
            לא נמצא מזהה למשרה הזו (id). אי אפשר לשמור.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>סטאטוס:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">בחר סטאטוס</option>
            <option value="new">New</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>

          <label>הערות:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="button-row">
            <button type="submit" disabled={missingId}>שמור</button>
            <button type="button" onClick={onClose}>ביטול</button>
          </div>
        </form>
      </div>
    </div>
  );
}
