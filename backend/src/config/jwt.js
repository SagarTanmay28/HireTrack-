// JWT helper file for token creation and verification.
// Access tokens are short-lived for everyday use, while refresh tokens are longer-lived and kept in cookies.
// This is the security layer that keeps the user session safe.

const jwt = require("jsonwebtoken");

// Access token: short-lived (15 min). Sent in response body, stored in memory on frontend.
// If stolen, it expires quickly so damage is limited.
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Refresh token: long-lived (7 days). Stored in HTTP-only cookie.
// HTTP-only means JS on the page CANNOT read it - protects against XSS attacks.
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
