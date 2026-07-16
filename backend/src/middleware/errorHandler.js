// Global error handler for the backend.
// This is the safety net for the API: when a controller fails, the error is caught here and
// converted into a clean JSON response instead of crashing the server.

// Global error handler - registered as the LAST middleware in index.js
// Any time a controller does next(err) or throws, it lands here.
// This keeps error handling out of individual controllers.

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({ message });
};

module.exports = { errorHandler };
