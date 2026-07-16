// Applications page.
// This page shows the full list of job applications, supports search and filters,
// and allows the user to add, edit, delete, and export data.

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Plus, Search, Download, Pencil, Trash2 } from "lucide-react";
import api from "../api/axios";
import ApplicationModal from "../components/ApplicationModal";

const STATUSES = ["All", "Applied", "Interview", "Offer", "Rejected", "Ghosted"];

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = adding new

  const fetchApps = useCallback(async () => {
    const params = {};
    if (search) params.search = search;
    if (status !== "All") params.status = status;
    const { data } = await api.get("/applications", { params });
    setApps(data);
  }, [search, status]);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this application?")) return;
    await api.delete(`/applications/${id}`);
    fetchApps();
  };

  const handleExport = async () => {
    const response = await api.get("/applications/export/csv", { responseType: "blob" });
    const url = URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url; a.download = "applications.csv"; a.click();
  };

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (app) => { setEditing(app); setModalOpen(true); };

  const badgeClass = (status) => `badge badge-${status.toLowerCase()}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "600" }}>Applications</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-ghost" onClick={handleExport}>
            <Download size={14} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={14} /> Add Application
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
          <input className="input" placeholder="Search company or role..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "30px" }} />
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              style={{
                padding: "6px 12px", borderRadius: "99px", fontSize: "12px",
                border: "1px solid", cursor: "pointer",
                borderColor: status === s ? "var(--accent)" : "var(--border)",
                background: status === s ? "var(--accent-bg)" : "transparent",
                color: status === s ? "var(--accent)" : "var(--text-muted)",
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        {apps.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
            <p style={{ fontSize: "15px", marginBottom: "6px" }}>No applications yet</p>
            <p style={{ fontSize: "12px" }}>Click "Add Application" to track your first one</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Company", "Role", "Status", "Applied", "Follow-up", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", color: "var(--text-muted)", fontWeight: "500", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map((app, i) => (
                <tr key={app.id}
                  style={{ borderBottom: i < apps.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.1s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px", fontWeight: "500" }}>
                    {app.company}
                    {app.job_url && <a href={app.job_url} target="_blank" rel="noreferrer" style={{ marginLeft: "6px", fontSize: "10px", color: "var(--accent)" }}>↗</a>}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{app.role}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "12px" }}>
                    {app.applied_date ? format(new Date(app.applied_date), "MMM d, yyyy") : "—"}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: app.follow_up_date ? "var(--amber)" : "var(--text-dim)" }}>
                    {app.follow_up_date ? format(new Date(app.follow_up_date), "MMM d") : "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
                      <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => openEdit(app)}>
                        <Pencil size={12} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: "4px 8px" }} onClick={() => handleDelete(app.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ApplicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => { setModalOpen(false); fetchApps(); }}
        initialData={editing}
      />
    </div>
  );
}
