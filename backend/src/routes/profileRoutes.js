const express = require("express");

const {
  getProfile,
  createProfile,
  updateProfile,
  uploadResume,
  downloadResume,
} = require("../controllers/profileController");

const authenticate = require("../middleware/auth");

const { uploadResume: upload } = require("../middleware/upload");

const router = express.Router();


// ------------------------------------------------------------
// AUTHENTICATION
// ------------------------------------------------------------
//
// Every profile route requires the user to be logged in.
//

// ------------------------------------------------------------
// GET MY PROFILE
// ------------------------------------------------------------

router.get(
  "/",
  authenticate,
  getProfile
);


// ------------------------------------------------------------
// CREATE PROFILE
// ------------------------------------------------------------

router.post(
  "/",
  authenticate,
  createProfile
);


// ------------------------------------------------------------
// UPDATE PROFILE
// ------------------------------------------------------------

router.put(
  "/",
  authenticate,
  updateProfile
);


// ------------------------------------------------------------
// UPLOAD / REPLACE RESUME
// ------------------------------------------------------------

router.post(
  "/resume",
  upload.single("resume"),
  authenticate,
  uploadResume
);


// ------------------------------------------------------------
// DOWNLOAD RESUME
// ------------------------------------------------------------

router.get(
  "/resume",
  authenticate,
  downloadResume
);


module.exports = router;