// Protected layout wrapper.
// Private pages are rendered inside this layout only after the user has been verified.

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();

  // Still checking session - show nothing (avoids flash of login page)
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>Loading...</div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
