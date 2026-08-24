const fs = require("fs");
const path = require("path");

const CandidateProfile = require("../models/CandidateProfile");

const {
  validateResume,
} = require("../utils/fileValidator");


// ------------------------------------------------------------
// RESUME DIRECTORY
// ------------------------------------------------------------

const resumeDirectory = path.join(
  process.cwd(),
  "uploads",
  "resumes"
);


// Create directory automatically.

if (!fs.existsSync(resumeDirectory)) {

  fs.mkdirSync(resumeDirectory, {
    recursive: true,
  });
}


// ------------------------------------------------------------
// CALCULATE PROFILE COMPLETION
// ------------------------------------------------------------
//
// Profile sections:
//
// 1. Phone
// 2. Location
// 3. Bio
// 4. Skills
// 5. Experience
// 6. Education
// 7. Resume
//
// Each section contributes equally.
// ------------------------------------------------------------

const calculateCompletion = (profile) => {

  let completed = 0;

  const totalFields = 7;


  // Phone

  if (profile.phone?.trim()) {
    completed++;
  }


  // Location

  if (profile.location?.trim()) {
    completed++;
  }


  // Bio

  if (profile.bio?.trim()) {
    completed++;
  }


  // Skills

  if (
    Array.isArray(profile.skills) &&
    profile.skills.length > 0
  ) {
    completed++;
  }


  // Experience

  if (
    typeof profile.experience === "number" &&
    profile.experience >= 0
  ) {
    completed++;
  }


  // Education

  if (profile.education?.trim()) {
    completed++;
  }


  // Resume

  if (profile.resume?.storedName) {
    completed++;
  }


  return Math.round(
    (completed / totalFields) * 100
  );
};


// ------------------------------------------------------------
// GET PROFILE
// ------------------------------------------------------------
//
// GET /api/profile
// ------------------------------------------------------------

const getProfile = async (req, res) => {

  try {

    const profile =
      await CandidateProfile.findOne({
        userId: req.user._id,
      });


    if (!profile) {

      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }


    return res.status(200).json({

      success: true,

      profile,

    });

  } catch (error) {

    console.error(
      "Get profile error:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message: "Failed to fetch candidate profile",

    });
  }
};


// ------------------------------------------------------------
// CREATE PROFILE
// ------------------------------------------------------------
//
// POST /api/profile
// ------------------------------------------------------------

const createProfile = async (req, res) => {

  try {

    const existingProfile =
      await CandidateProfile.findOne({
        userId: req.user._id,
      });


    if (existingProfile) {

      return res.status(409).json({

        success: false,

        message: "Candidate profile already exists",

      });
    }


    const {
      phone,
      location,
      bio,
      skills,
      experience,
      education,
    } = req.body;


    const profile =
      await CandidateProfile.create({

        userId: req.user._id,

        phone,

        location,

        bio,

        skills:
          Array.isArray(skills)
            ? skills
            : [],

        experience:
          experience !== undefined
            ? experience
            : 0,

        education,

      });


    profile.completePercentage =
      calculateCompletion(profile);


    await profile.save();


    return res.status(201).json({

      success: true,

      message:
        "Candidate profile created successfully",

      profile,

    });

  } catch (error) {

    console.error(
      "Create profile error:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to create candidate profile",

    });
  }
};


// ------------------------------------------------------------
// UPDATE PROFILE
// ------------------------------------------------------------
//
// PUT /api/profile
// ------------------------------------------------------------

const updateProfile = async (req, res) => {

  try {

    const profile =
      await CandidateProfile.findOne({
        userId: req.user._id,
      });


    if (!profile) {

      return res.status(404).json({

        success: false,

        message:
          "Candidate profile not found",

      });
    }


    const {
      phone,
      location,
      bio,
      skills,
      experience,
      education,
    } = req.body;


    // Only update fields that were provided.

    if (phone !== undefined) {
      profile.phone = phone;
    }


    if (location !== undefined) {
      profile.location = location;
    }


    if (bio !== undefined) {
      profile.bio = bio;
    }


    if (skills !== undefined) {

      if (Array.isArray(skills)) {
        profile.skills = skills;
      }
    }


    if (experience !== undefined) {
      profile.experience = experience;
    }


    if (education !== undefined) {
      profile.education = education;
    }


    // Recalculate completion.

    profile.completePercentage =
      calculateCompletion(profile);


    await profile.save();


    return res.status(200).json({

      success: true,

      message:
        "Candidate profile updated successfully",

      profile,

    });

  } catch (error) {

    console.error(
      "Update profile error:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to update candidate profile",

    });
  }
};


// ------------------------------------------------------------
// UPLOAD / REPLACE RESUME
// ------------------------------------------------------------
//
// POST /api/profile/resume
//
// Form-data field:
//
// resume
// ------------------------------------------------------------

const uploadResume = async (req, res) => {

  let savedFilePath = null;


  try {

    // --------------------------------------------------------
    // CHECK FILE
    // --------------------------------------------------------

    if (!req.file) {

      return res.status(400).json({

        success: false,

        message: "Resume file is required",

      });
    }


    // --------------------------------------------------------
    // VALIDATE ACTUAL FILE CONTENT
    // --------------------------------------------------------

    const validation =
      validateResume(
        req.file.buffer,
        req.file.originalname
      );


    if (!validation.valid) {

      return res.status(400).json({

        success: false,

        message: validation.message,

      });
    }


    // --------------------------------------------------------
    // FIND PROFILE
    // --------------------------------------------------------

    const profile =
      await CandidateProfile.findOne({
        userId: req.user._id,
      });


    if (!profile) {

      return res.status(404).json({

        success: false,

        message:
          "Candidate profile not found",

      });
    }


    // --------------------------------------------------------
    // DELETE OLD RESUME AFTER NEW FILE HAS BEEN VALIDATED
    // --------------------------------------------------------

    const oldResumePath =
      profile.resume?.path;


    // --------------------------------------------------------
    // GENERATE UNIQUE FILENAME
    // --------------------------------------------------------

    const extension =
      path.extname(
        req.file.originalname
      ).toLowerCase();


    const storedName =
      `${req.user._id}-${Date.now()}${extension}`;


    const filePath =
      path.join(
        resumeDirectory,
        storedName
      );


    // --------------------------------------------------------
    // SAVE NEW FILE
    // --------------------------------------------------------

    fs.writeFileSync(
      filePath,
      req.file.buffer
    );


    savedFilePath = filePath;


    // --------------------------------------------------------
    // DELETE OLD FILE
    // --------------------------------------------------------

    if (
      oldResumePath &&
      oldResumePath !== filePath &&
      fs.existsSync(oldResumePath)
    ) {

      fs.unlinkSync(oldResumePath);
    }


    // --------------------------------------------------------
    // SAVE RESUME REFERENCE
    // --------------------------------------------------------

    profile.resume = {

      originalName:
        req.file.originalname,

      storedName,

      path: filePath,

      mimeType:
        validation.mimeType,

      size:
        req.file.size,

    };


    // --------------------------------------------------------
    // UPDATE COMPLETION
    // --------------------------------------------------------

    profile.completePercentage =
      calculateCompletion(profile);


    await profile.save();


    return res.status(200).json({

      success: true,

      message:
        "Resume uploaded successfully",

      resume: {

        originalName:
          profile.resume.originalName,

        mimeType:
          profile.resume.mimeType,

        size:
          profile.resume.size,

      },

      completePercentage:
        profile.completePercentage,

    });

  } catch (error) {

    // Remove newly-created file if MongoDB save failed.

    if (
      savedFilePath &&
      fs.existsSync(savedFilePath)
    ) {

      fs.unlinkSync(savedFilePath);
    }


    console.error(
      "Resume upload error:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to upload resume",

    });
  }
};


// ------------------------------------------------------------
// DOWNLOAD RESUME
// ------------------------------------------------------------
//
// GET /api/profile/resume
//
// The authenticated user can only download their own resume.
// ------------------------------------------------------------

const downloadResume = async (req, res) => {

  try {

    const profile =
      await CandidateProfile.findOne({
        userId: req.user._id,
      });


    if (
      !profile ||
      !profile.resume?.path
    ) {

      return res.status(404).json({

        success: false,

        message: "Resume not found",

      });
    }


    // Make sure the file actually exists.

    if (
      !fs.existsSync(
        profile.resume.path
      )
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Resume file not found",

      });
    }


    // Send the file using the original filename.

    return res.download(

      profile.resume.path,

      profile.resume.originalName,

      (error) => {

        if (error) {

          console.error(
            "Resume download error:",
            error.message
          );
        }
      }

    );

  } catch (error) {

    console.error(
      "Resume download error:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to download resume",

    });
  }
};


// ------------------------------------------------------------
// EXPORT
// ------------------------------------------------------------

module.exports = {

  getProfile,

  createProfile,

  updateProfile,

  uploadResume,

  downloadResume,

  calculateCompletion,

};