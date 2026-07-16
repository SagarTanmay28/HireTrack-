// Route file for analytics endpoints.
// These endpoints power the dashboard charts and follow-up reminder cards.

const router = require("express").Router();
const { getSummary, getWeeklyTrend, getUpcomingFollowups } = require("../controllers/analyticsController");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get("/summary", getSummary);
router.get("/weekly", getWeeklyTrend);
router.get("/followups", getUpcomingFollowups);

module.exports = router;
