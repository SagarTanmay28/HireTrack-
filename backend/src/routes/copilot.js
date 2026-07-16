const router = require("express").Router();
const { analyzeResume, prepareInterview } = require("../controllers/copilotController");
const { authenticate } = require("../middleware/auth");

router.post("/resume-match", authenticate, analyzeResume);
router.post("/interview-prep", authenticate, prepareInterview);

module.exports = router;
