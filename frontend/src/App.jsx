// Main application router.
// This file decides which page should appear based on the URL and protects private pages.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Copilot from "./pages/Copilot";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<AuthPage />} />

          {/* Protected routes - wrapped in sidebar layout */}
          <Route path="/dashboard" element={
            <ProtectedLayout><Dashboard /></ProtectedLayout>
          } />
          <Route path="/applications" element={
            <ProtectedLayout><Applications /></ProtectedLayout>
          } />
          <Route path="/copilot" element={
            <ProtectedLayout><Copilot /></ProtectedLayout>
          } />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
