const router = require("express").Router();
const { upload, uploadResume, getResume } = require("../controllers/resumeController");
const { authenticate } = require("../middleware/auth");

router.post("/upload", authenticate, upload.single("resume"), uploadResume);
router.get("/latest", authenticate, getResume);

module.exports = router;
