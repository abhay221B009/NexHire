const express = require("express");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");

const authenticate = require("../middleware/auth");

const router = express.Router();


// ------------------------------------------------------------
// PUBLIC ROUTES
// ------------------------------------------------------------

router.get(
  "/",
  getJobs
);


// ------------------------------------------------------------
// RECRUITER ROUTES
// ------------------------------------------------------------

router.get(
  "/recruiter/my-jobs",
  authenticate,
  getMyJobs
);

router.post(
  "/",
  authenticate,
  createJob
);

router.put(
  "/:id",
  authenticate,
  updateJob
);

router.delete(
  "/:id",
  authenticate,
  deleteJob
);


// ------------------------------------------------------------
// SINGLE JOB
// ------------------------------------------------------------

router.get(
  "/:id",
  getJobById
);


module.exports = router;