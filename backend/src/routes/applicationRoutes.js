const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const authenticate = require("../middleware/auth");

const router = express.Router();

// All application routes require authentication
router.use(authenticate);

// Candidate routes
router.post("/", applyForJob);
router.get("/my-applications", getMyApplications);

// Recruiter routes
router.get("/job/:jobId", getJobApplications);
router.patch("/:id/status", updateApplicationStatus);
router.put("/:id/status", updateApplicationStatus);

module.exports = router;
