// Route file for authentication endpoints.
// These routes expose the public and protected auth APIs used by the frontend.

const router = require("express").Router();
const { register, login, oauth, refresh, logout, getMe } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/oauth", oauth);
router.post("/refresh", refresh);      // Uses HTTP-only cookie
router.post("/logout", logout);
router.get("/me", authenticate, getMe); // Protected route

module.exports = router;
