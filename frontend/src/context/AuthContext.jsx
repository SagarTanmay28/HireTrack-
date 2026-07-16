// Authentication context for the frontend.
// This file stores the logged-in user and exposes login, register, and logout helpers
// so all pages can use the same auth state.

import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

// Context holds: user object, loading state, login/logout/register functions
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // True while checking if user is already logged in

  // On app load, check if there's a valid session
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api.get("/auth/me")
        .then(({ data }) => setUser(data))
        .catch(() => localStorage.removeItem("accessToken"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    return data;
  };

  const oauth = async (provider, profile) => {
    const { data } = await api.post("/auth/oauth", { provider, profile });
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, oauth, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook - cleaner to use in components
export const useAuth = () => useContext(AuthContext);
