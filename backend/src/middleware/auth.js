// JWT authentication middleware.
// This middleware checks every protected request before the controller runs.
// If the access token is valid, the user is allowed to proceed; otherwise the request is rejected.

const { verifyAccessToken } = require("../config/jwt");

// This middleware runs BEFORE any protected route handler.
// It checks if the request has a valid JWT access token.
// If yes → attaches userId to req and calls next()
// If no  → returns 401 Unauthorized immediately

const authenticate = (req, res, next) => {
  // Token comes in the Authorization header as: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId; // Now available in all downstream handlers
    next();
  } catch (err) {
    // Token expired or invalid
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authenticate };
