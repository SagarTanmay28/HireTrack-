// Dashboard page.
// It fetches analytics data from the backend and displays charts and reminder cards
// so the user can quickly understand the job application pipeline.

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format } from "date-fns";
import api from "../api/axios";

const STATUS_COLORS = {
  Applied: "var(--blue)", Interview: "var(--amber)",
  Offer: "var(--green)", Rejected: "var(--red)", Ghosted: "var(--text-muted)"
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [followups, setFollowups] = useState([]);

  useEffect(() => {
    api.get("/analytics/summary").then(({ data }) => setSummary(data));
    api.get("/analytics/weekly").then(({ data }) => setWeekly(data));
    api.get("/analytics/followups").then(({ data }) => setFollowups(data));
  }, []);

  const funnelData = summary
    ? ["Applied", "Interview", "Offer", "Rejected", "Ghosted"].map((s) => ({
        name: s, count: summary.counts[s] || 0,
      }))
    : [];

  const weeklyData = weekly.map((w) => ({
    week: format(new Date(w.week), "MMM d"),
    count: w.count,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "600" }}>Dashboard</h1>

      {/* Stat Cards */}
      {summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
          {[
            { label: "Total", value: summary.total, color: "var(--accent)" },
            { label: "Applied", value: summary.counts.Applied, color: "var(--blue)" },
            { label: "Interviews", value: summary.counts.Interview, color: "var(--amber)" },
            { label: "Offers", value: summary.counts.Offer, color: "var(--green)" },
            { label: "Rejected", value: summary.counts.Rejected, color: "var(--red)" },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>{s.label}</div>
              <div style={{ fontSize: "28px", fontWeight: "600", color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Funnel Bar Chart */}
        <div className="card">
          <h3 style={{ fontSize: "13px", fontWeight: "500", marginBottom: "16px", color: "var(--text-muted)" }}>Application Funnel</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={funnelData} barSize={32}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {funnelData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend */}
        <div className="card">
          <h3 style={{ fontSize: "13px", fontWeight: "500", marginBottom: "16px", color: "var(--text-muted)" }}>Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData} barSize={24}>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Follow-ups */}
      {followups.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: "13px", fontWeight: "500", marginBottom: "14px", color: "var(--text-muted)" }}>
            ⏰ Follow-ups this week
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {followups.map((f) => (
              <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
                <div>
                  <span style={{ fontWeight: "500" }}>{f.company}</span>
                  <span style={{ color: "var(--text-muted)", marginLeft: "8px", fontSize: "12px" }}>{f.role}</span>
                </div>
                <span style={{ fontSize: "12px", color: "var(--amber)" }}>
                  {format(new Date(f.follow_up_date), "MMM d")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
