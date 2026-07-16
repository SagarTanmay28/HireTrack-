// Route file for application management endpoints.
// The frontend calls these APIs to create, view, edit, delete, and export job applications.

const router = require("express").Router();
const {
  getApplications, getApplication, createApplication,
  updateApplication, deleteApplication, exportCSV
} = require("../controllers/applicationController");
const { authenticate } = require("../middleware/auth");

// All routes here require a valid JWT
router.use(authenticate);

router.get("/export/csv", exportCSV);        // Must be before /:id route
router.get("/", getApplications);
router.get("/:id", getApplication);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

module.exports = router;
