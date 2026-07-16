// Backend entry point for HireTrack.
// This file starts the Express server, enables cross-origin requests, mounts all API routes,
// and initializes the database and scheduled reminders when the app boots.
// Interview note: if someone asks "where does the backend start?", this is the answer.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { initDB } = require("./config/db");
const { startCronJobs } = require("./config/cron");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const applicationRoutes = require("./routes/applications");
const analyticsRoutes = require("./routes/analytics");
const copilotRoutes = require("./routes/copilot");
const resumeRoutes = require("./routes/resume");

const app = express();

// --- Middleware ---
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,  // Required for cookies to work cross-origin
}));
app.use(express.json());
app.use(cookieParser()); // Parses cookies from incoming requests

// --- Routes ---
// All routes prefixed with /api/
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/resume", resumeRoutes);

// Health check endpoint - used by deployment platforms to verify server is running
app.get("/health", (req, res) => res.json({ status: "ok" }));

// --- Error Handler (must be last) ---
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;

const start = async () => {
  await initDB();         // Create tables if they don't exist
  startCronJobs();        // Start scheduled reminder emails
  app.listen(PORT, () => {
    console.log(`🚀 HireTrack backend running on port ${PORT}`);
  });
};

start();
