// Login and registration page.
// This is the entry page for first-time users and returning users.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, oauth, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setError("");
    setLoading(true);
    try {
      await oauth(provider, {
        id: `${provider}-${Date.now()}`,
        email: form.email || `${provider}@example.com`,
        name: form.name || `${provider} user`,
        avatar_url: "",
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "OAuth sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "28px", fontWeight: "600", color: "var(--accent)" }}>HireTrack</div>
          <p style={{ color: "var(--text-muted)", marginTop: "6px", fontSize: "13px" }}>
            Track every application. Land the job.
          </p>
        </div>

        <div className="card">
          {/* Toggle */}
          <div style={{ display: "flex", background: "var(--bg)", borderRadius: "var(--radius-sm)", padding: "3px", marginBottom: "24px" }}>
            {["login", "register"].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: "7px", borderRadius: "var(--radius-sm)",
                  background: mode === m ? "var(--bg-card)" : "transparent",
                  color: mode === m ? "var(--text)" : "var(--text-muted)",
                  fontWeight: mode === m ? "500" : "400",
                  fontSize: "13px", transition: "all 0.15s",
                  border: mode === m ? "1px solid var(--border)" : "none"
                }}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {mode === "register" && (
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px", display: "block" }}>Name</label>
                <input className="input" placeholder="Your name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
            )}

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px", display: "block" }}>Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px", display: "block" }}>Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>

            {error && (
              <p style={{ color: "var(--red)", fontSize: "12px", background: "var(--red-bg)", padding: "8px 12px", borderRadius: "var(--radius-sm)" }}>
                {error}
              </p>
            )}

            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "10px", marginTop: "4px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <button type="button" className="btn btn-ghost" onClick={() => handleOAuth("google")} disabled={loading}>
                Continue with Google
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => handleOAuth("github")} disabled={loading}>
                Continue with GitHub
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
