const Application = require("../models/Application");
const Job = require("../models/Job");
const CandidateProfile = require("../models/CandidateProfile");


// ------------------------------------------------------------
// APPLY FOR A JOB (CANDIDATE)
// ------------------------------------------------------------
//
// POST /api/applications
// ------------------------------------------------------------

const applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can apply for jobs",
      });
    }

    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job || !job.isActive) {
      return res.status(404).json({
        success: false,
        message: "Job not found or no longer active",
      });
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({
      candidateId: req.user._id,
      jobId: jobId,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      candidateId: req.user._id,
      jobId: jobId,
      stage: "Applied",
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    console.error("Apply for job error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};


// ------------------------------------------------------------
// GET MY APPLICATIONS (CANDIDATE)
// ------------------------------------------------------------
//
// GET /api/applications/my-applications
// ------------------------------------------------------------

const getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can view candidate applications",
      });
    }

    const applications = await Application.find({
      candidateId: req.user._id,
    })
      .populate("jobId", "title company location workMode experienceLevel isActive")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    console.error("Get my applications error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};


// ------------------------------------------------------------
// GET APPLICANTS FOR A JOB (RECRUITER)
// ------------------------------------------------------------
//
// GET /api/applications/job/:jobId
// ------------------------------------------------------------

const getJobApplications = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can view job applications",
      });
    }

    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view applications for this job",
      });
    }

    const applications = await Application.find({ jobId })
      .populate("candidateId", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    // Attach candidate profile data if available
    for (let app of applications) {
      if (app.candidateId?._id) {
        const profile = await CandidateProfile.findOne({
          userId: app.candidateId._id,
        }).lean();
        app.candidateProfile = profile || null;
      }
    }

    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    console.error("Get job applications error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications for job",
    });
  }
};


// ------------------------------------------------------------
// UPDATE APPLICATION STATUS / STAGE (RECRUITER)
// ------------------------------------------------------------
//
// PATCH /api/applications/:id/status or PUT /api/applications/:id/status
// ------------------------------------------------------------

const updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can update application status",
      });
    }

    const { id } = req.params;
    const stage = req.body.stage || req.body.status;

    if (!stage) {
      return res.status(400).json({
        success: false,
        message: "Application status or stage is required",
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const job = await Job.findById(application.jobId);

    if (!job || job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this application",
      });
    }

    application.stage = stage;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });

  } catch (error) {
    console.error("Update application status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};


module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};
