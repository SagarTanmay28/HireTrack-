// Sidebar navigation component.
// It gives users quick access to the main pages and also provides sign-out functionality.

import { NavLink } from "react-router-dom";
import { LayoutDashboard, Briefcase, Sparkles, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/applications", icon: Briefcase, label: "Applications" },
  { to: "/copilot", icon: Sparkles, label: "Copilot" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside style={{
      width: "220px", minHeight: "100vh", background: "var(--bg-card)",
      borderRight: "1px solid var(--border)", display: "flex",
      flexDirection: "column", padding: "20px 12px", flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{ padding: "4px 8px 24px", fontWeight: "700", fontSize: "18px", color: "var(--accent)", letterSpacing: "-0.5px" }}>
        HireTrack
      </div>

      {/* Nav Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: "10px",
            padding: "9px 10px", borderRadius: "var(--radius-sm)",
            fontSize: "13px", fontWeight: "500", transition: "all 0.15s",
            background: isActive ? "var(--accent-bg)" : "transparent",
            color: isActive ? "var(--accent)" : "var(--text-muted)",
            textDecoration: "none",
          })}>
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={13} color="var(--accent)" />
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "12px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={logout} style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 10px", borderRadius: "var(--radius-sm)",
          fontSize: "12px", color: "var(--text-muted)", cursor: "pointer",
          border: "none", background: "transparent", transition: "all 0.15s",
          width: "100%",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--red-bg)"; e.currentTarget.style.color = "var(--red)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}>
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
