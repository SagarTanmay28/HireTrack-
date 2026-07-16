// Reusable modal for adding or editing a job application.
// This component collects the application details from the user and sends them to the backend.

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../api/axios";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected", "Ghosted"];
const EMPTY = { company: "", role: "", status: "Applied", applied_date: "", follow_up_date: "", notes: "", job_url: "", salary_range: "", location: "" };

export default function ApplicationModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // When editing, prefill form with existing data
  useEffect(() => {
    if (initialData) {
      setForm({
        company: initialData.company || "",
        role: initialData.role || "",
        status: initialData.status || "Applied",
        applied_date: initialData.applied_date?.split("T")[0] || "",
        follow_up_date: initialData.follow_up_date?.split("T")[0] || "",
        notes: initialData.notes || "",
        job_url: initialData.job_url || "",
        salary_range: initialData.salary_range || "",
        location: initialData.location || "",
      });
    } else {
      setForm(EMPTY);
    }
    setError("");
  }, [initialData, open]);

  if (!open) return null;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (initialData) {
        await api.put(`/applications/${initialData.id}`, form);
      } else {
        await api.post("/applications", form);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, children }) => (
    <div>
      <label style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "5px", display: "block" }}>{label}</label>
      {children}
    </div>
  );

  return (
    // Backdrop
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px" }}>
      {/* Modal */}
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflow: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600" }}>
            {initialData ? "Edit Application" : "Add Application"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--text-muted)", cursor: "pointer", border: "none", background: "none", display: "flex" }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Company *">
              <input className="input" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="e.g. Google" required />
            </Field>
            <Field label="Role *">
              <input className="input" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. SDE-1" required />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Status">
              <select className="input" value={form.status} onChange={(e) => set("status", e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Location">
              <input className="input" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Bangalore" />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Applied Date">
              <input className="input" type="date" value={form.applied_date} onChange={(e) => set("applied_date", e.target.value)} />
            </Field>
            <Field label="Follow-up Date">
              <input className="input" type="date" value={form.follow_up_date} onChange={(e) => set("follow_up_date", e.target.value)} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Salary Range">
              <input className="input" value={form.salary_range} onChange={(e) => set("salary_range", e.target.value)} placeholder="e.g. 15-20 LPA" />
            </Field>
            <Field label="Job URL">
              <input className="input" value={form.job_url} onChange={(e) => set("job_url", e.target.value)} placeholder="https://..." />
            </Field>
          </div>

          <Field label="Notes">
            <textarea className="input" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)}
              placeholder="Interview rounds, contacts, anything..." style={{ resize: "vertical" }} />
          </Field>

          {error && <p style={{ color: "var(--red)", fontSize: "12px", background: "var(--red-bg)", padding: "8px 12px", borderRadius: "var(--radius-sm)" }}>{error}</p>}

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
