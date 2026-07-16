// Scheduled reminder system for follow-up emails.
// This file uses node-cron to run a daily job and nodemailer to send reminder emails
// to users when a follow-up date matches today.

const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { pool } = require("../config/db");

// Configure Gmail transporter
// You need to enable "App Passwords" in your Google account settings
// (not your regular Gmail password - a special app-specific one)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendFollowUpReminders = async () => {
  try {
    // Find all applications where follow_up_date is TODAY
    // and join with users table to get their email
    const result = await pool.query(
      `SELECT a.company, a.role, a.status, a.follow_up_date, u.email, u.name
       FROM applications a
       JOIN users u ON u.id = a.user_id
       WHERE a.follow_up_date = CURRENT_DATE`
    );

    for (const app of result.rows) {
      await transporter.sendMail({
        from: `"HireTrack" <${process.env.EMAIL_USER}>`,
        to: app.email,
        subject: `⏰ Follow up with ${app.company} today`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #1a1a2e;">Follow-up Reminder</h2>
            <p>Hi ${app.name},</p>
            <p>You set a reminder to follow up on your <strong>${app.role}</strong> application at <strong>${app.company}</strong> today.</p>
            <p>Current status: <span style="background:#f0f0f0; padding: 2px 8px; border-radius: 4px;">${app.status}</span></p>
            <p style="margin-top: 24px; color: #666;">Good luck! — HireTrack</p>
          </div>
        `,
      });
      console.log(`📧 Reminder sent to ${app.email} for ${app.company}`);
    }
  } catch (err) {
    console.error("Cron job error:", err.message);
  }
};

// Schedule: runs every day at 8:00 AM
// Cron syntax: "minute hour day month weekday"
const startCronJobs = () => {
  cron.schedule("0 8 * * *", () => {
    console.log("⏰ Running follow-up reminder cron job...");
    sendFollowUpReminders();
  });
  console.log("✅ Cron jobs scheduled");
};

module.exports = { startCronJobs };
