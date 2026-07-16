// Analytics controller for dashboard statistics.
// This file builds the numbers and charts shown on the dashboard, such as the funnel view,
// weekly activity, and upcoming follow-up reminders.

const { pool } = require("../config/db");

// GET /api/analytics/summary
// Returns counts per status + total - used for the funnel chart
const getSummary = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT status, COUNT(*) as count
       FROM applications WHERE user_id = $1
       GROUP BY status`,
      [req.userId]
    );

    // Build a structured object with defaults so frontend doesn't need null checks
    const statuses = ["Applied", "Interview", "Offer", "Rejected", "Ghosted"];
    const counts = {};
    statuses.forEach(s => counts[s] = 0);
    result.rows.forEach(r => counts[r.status] = parseInt(r.count));

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    res.json({ counts, total });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/weekly
// Returns applications added per week for the last 8 weeks - used for trend chart
const getWeeklyTrend = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         DATE_TRUNC('week', created_at) as week,
         COUNT(*) as count
       FROM applications
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '8 weeks'
       GROUP BY week
       ORDER BY week ASC`,
      [req.userId]
    );

    const trend = result.rows.map(r => ({
      week: r.week,
      count: parseInt(r.count),
    }));

    res.json(trend);
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/upcoming-followups
// Returns applications with follow_up_date in the next 7 days
const getUpcomingFollowups = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, company, role, status, follow_up_date
       FROM applications
       WHERE user_id = $1
         AND follow_up_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
       ORDER BY follow_up_date ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getWeeklyTrend, getUpcomingFollowups };
