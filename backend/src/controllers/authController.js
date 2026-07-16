// Authentication controller for user signup, login, token refresh, logout, and profile fetch.
// This file handles the secure user journey: create account, sign in, keep the session alive,
// and end the session when the user logs out.

const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../config/jwt");

// Helper: set refresh token as HTTP-only cookie
const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,       // JS cannot access this cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict",   // Prevents CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    // Check if email already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return res.status(409).json({ message: "Email already registered" });

    // bcrypt hashes the password with 12 salt rounds.
    // Even if DB is leaked, passwords can't be reversed.
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );
    const user = result.rows[0];

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in DB (so we can revoke it on logout)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, refreshToken, expiresAt]
    );

    setRefreshCookie(res, refreshToken);
    res.status(201).json({ accessToken, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/oauth
const oauth = async (req, res, next) => {
  try {
    const { provider, profile } = req.body;

    if (!provider || !profile?.email) {
      return res.status(400).json({ message: "Provider and profile are required" });
    }

    const normalizedEmail = profile.email.toLowerCase();
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);
    const existingUser = existing.rows[0];

    const providerId = profile.id || `${provider}-${normalizedEmail}`;
    const name = profile.name || profile.login || normalizedEmail.split("@")[0];

    let user;
    if (existingUser) {
      const updated = await pool.query(
        "UPDATE users SET name = COALESCE($1, name), auth_provider = COALESCE($2, auth_provider), provider_id = COALESCE($3, provider_id), avatar_url = COALESCE($4, avatar_url) WHERE id = $5 RETURNING id, name, email, avatar_url",
        [name, provider, providerId, profile.avatar_url || existingUser.avatar_url, existingUser.id]
      );
      user = updated.rows[0];
    } else {
      const inserted = await pool.query(
        "INSERT INTO users (name, email, password, auth_provider, provider_id, avatar_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, avatar_url",
        [name, normalizedEmail, null, provider, providerId, profile.avatar_url || null]
      );
      user = inserted.rows[0];
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, refreshToken, expiresAt]
    );

    setRefreshCookie(res, refreshToken);
    res.json({ accessToken, user: { id: user.id, name: user.name, email: normalizedEmail, avatar_url: user.avatar_url } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // bcrypt.compare hashes the input and compares to stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, refreshToken, expiresAt]
    );

    setRefreshCookie(res, refreshToken);
    res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh
// Called automatically by frontend when access token expires
const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    // Verify token is valid and not tampered with
    const decoded = verifyRefreshToken(token);

    // Also check it exists in DB (wasn't revoked on logout)
    const stored = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()",
      [token, decoded.userId]
    );
    if (stored.rows.length === 0)
      return res.status(401).json({ message: "Refresh token invalid or expired" });

    const accessToken = generateAccessToken(decoded.userId);

    // Rotate refresh token (issue new one, delete old) - improves security
    const newRefreshToken = generateRefreshToken(decoded.userId);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [decoded.userId, newRefreshToken, expiresAt]
    );

    setRefreshCookie(res, newRefreshToken);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      // Delete from DB so the token can never be used again
      await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, oauth, refresh, logout, getMe };
