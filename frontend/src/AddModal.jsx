import React, { useState } from "react";
import "./EditModal.css"; // reuse the modal style

export default function AddModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    url: "",
    date_applied: new Date().toISOString().split("T")[0],
    status: "",
    comment: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✖️</button>
        <h2>הוספת משרה חדשה</h2>
        <form onSubmit={handleSubmit}>
          <label>משרה:</label>
          <input name="title" value={form.title} onChange={handleChange} required />

          <label>חברה:</label>
          <input name="company" value={form.company} onChange={handleChange} required />

          <label>מיקום:</label>
          <input name="location" value={form.location} onChange={handleChange} />

          <label>URL:</label>
          <input name="url" value={form.url} onChange={handleChange} />

          <label>תאריך הגשה:</label>
          <input type="date" name="date_applied" value={form.date_applied} onChange={handleChange} />

          <label>סטאטוס:</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="">בחר</option>
            <option value="new">New</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>

          <label>הערות:</label>
          <textarea name="comment" value={form.comment} onChange={handleChange} />

          <div className="button-row">
            <button type="submit">שמור</button>
            <button type="button" onClick={onClose}>ביטול</button>
          </div>
        </form>
      </div>
    </div>
  );
}
