// Application controller for CRUD operations on job applications.
// This file is the main logic layer for saving, reading, updating, deleting, and exporting
// a user's job applications from the PostgreSQL database.

const { pool } = require("../config/db");

// GET /api/applications
// Returns all applications for the logged-in user, with optional filters
const getApplications = async (req, res, next) => {
  try {
    const { status, search, sort = "created_at", order = "DESC" } = req.query;

    let query = `SELECT * FROM applications WHERE user_id = $1`;
    const params = [req.userId];

    // Dynamically build WHERE clause based on query params
    if (status && status !== "All") {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (company ILIKE $${params.length} OR role ILIKE $${params.length})`;
    }

    // Whitelist sort columns to prevent SQL injection
    const validSort = ["created_at", "applied_date", "company", "status"];
    const safeSort = validSort.includes(sort) ? sort : "created_at";
    const safeOrder = order === "ASC" ? "ASC" : "DESC";

    query += ` ORDER BY ${safeSort} ${safeOrder}`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/:id
const getApplication = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM applications WHERE id = $1 AND user_id = $2",
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Application not found" });

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /api/applications
const createApplication = async (req, res, next) => {
  try {
    const {
      company, role, status = "Applied",
      applied_date, follow_up_date, notes,
      job_url, salary_range, location
    } = req.body;

    if (!company || !role)
      return res.status(400).json({ message: "Company and role are required" });

    const result = await pool.query(
      `INSERT INTO applications
        (user_id, company, role, status, applied_date, follow_up_date, notes, job_url, salary_range, location)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [req.userId, company, role, status, applied_date || new Date(), follow_up_date, notes, job_url, salary_range, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /api/applications/:id
const updateApplication = async (req, res, next) => {
  try {
    const {
      company, role, status,
      applied_date, follow_up_date, notes,
      job_url, salary_range, location
    } = req.body;

    const result = await pool.query(
      `UPDATE applications SET
        company = COALESCE($1, company),
        role = COALESCE($2, role),
        status = COALESCE($3, status),
        applied_date = COALESCE($4, applied_date),
        follow_up_date = COALESCE($5, follow_up_date),
        notes = COALESCE($6, notes),
        job_url = COALESCE($7, job_url),
        salary_range = COALESCE($8, salary_range),
        location = COALESCE($9, location),
        updated_at = NOW()
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [company, role, status, applied_date, follow_up_date, notes, job_url, salary_range, location, req.params.id, req.userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Application not found" });

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/applications/:id
const deleteApplication = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Application not found" });

    res.json({ message: "Application deleted" });
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/export/csv
// Generates a CSV string from all the user's applications
const exportCSV = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT company, role, status, applied_date, follow_up_date, location, salary_range, notes, job_url FROM applications WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );

    const headers = ["Company","Role","Status","Applied Date","Follow Up Date","Location","Salary Range","Notes","Job URL"];
    const rows = result.rows.map(r =>
      [r.company, r.role, r.status, r.applied_date, r.follow_up_date, r.location, r.salary_range, r.notes, r.job_url]
        .map(v => `"${(v || "").toString().replace(/"/g, '""')}"`)
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=applications.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

module.exports = { getApplications, getApplication, createApplication, updateApplication, deleteApplication, exportCSV };
