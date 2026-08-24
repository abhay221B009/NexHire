const Job = require("../models/Job");


// ------------------------------------------------------------
// CREATE JOB
// ------------------------------------------------------------
//
// Only authenticated recruiters should be able to create jobs.
//

const createJob = async (req, res) => {
  try {

    // --------------------------------------------------------
    // CHECK RECRUITER ROLE
    // --------------------------------------------------------

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can create jobs",
      });
    }


    const {
      title,
      company,
      location,
      skills,
      description,
      experienceLevel,
      workMode,
    } = req.body;


    // --------------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------------

    if (
      !title ||
      !company ||
      !location ||
      !description ||
      !experienceLevel ||
      !workMode
    ) {
      return res.status(400).json({
        success: false,
        message: "All required job fields must be provided",
      });
    }


    // --------------------------------------------------------
    // CREATE JOB
    // --------------------------------------------------------

    const job = await Job.create({
      recruiterId: req.user._id,
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      skills: Array.isArray(skills)
        ? skills.map((skill) => skill.trim()).filter(Boolean)
        : [],
      description: description.trim(),
      experienceLevel: experienceLevel.trim(),
      workMode,
    });


    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });

  } catch (error) {

    console.error("Create job error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create job",
    });

  }
};


// ------------------------------------------------------------
// GET ALL ACTIVE JOBS
// ------------------------------------------------------------

const getJobs = async (req, res) => {
  try {

    const jobs = await Job.find({
      isActive: true,
    })
      .sort({
        createdAt: -1,
      })
      .lean();


    return res.status(200).json({
      success: true,
      jobs,
    });

  } catch (error) {

    console.error("Get jobs error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });

  }
};


// ------------------------------------------------------------
// GET SINGLE JOB
// ------------------------------------------------------------

const getJobById = async (req, res) => {
  try {

    const job = await Job.findOne({
      _id: req.params.id,
      isActive: true,
    }).lean();


    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }


    return res.status(200).json({
      success: true,
      job,
    });

  } catch (error) {

    console.error("Get job error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });

  }
};


// ------------------------------------------------------------
// UPDATE JOB
// ------------------------------------------------------------

const updateJob = async (req, res) => {
  try {

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can update jobs",
      });
    }


    const job = await Job.findById(req.params.id);


    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }


    // --------------------------------------------------------
    // OWNERSHIP CHECK
    // --------------------------------------------------------

    if (
      job.recruiterId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to modify this job",
      });
    }


    const allowedFields = [
      "title",
      "company",
      "location",
      "skills",
      "description",
      "experienceLevel",
      "workMode",
      "isActive",
    ];


    for (const field of allowedFields) {

      if (req.body[field] !== undefined) {

        job[field] = req.body[field];

      }

    }


    await job.save();


    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });

  } catch (error) {

    console.error("Update job error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update job",
    });

  }
};


// ------------------------------------------------------------
// DELETE JOB
// ------------------------------------------------------------
//
// We use a soft delete.
//
// This keeps application/job history intact.
//

const deleteJob = async (req, res) => {
  try {

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can delete jobs",
      });
    }


    const job = await Job.findById(req.params.id);


    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }


    // --------------------------------------------------------
    // OWNERSHIP CHECK
    // --------------------------------------------------------

    if (
      job.recruiterId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this job",
      });
    }


    job.isActive = false;

    await job.save();


    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {

    console.error("Delete job error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });

  }
};


// ------------------------------------------------------------
// GET RECRUITER'S OWN JOBS
// ------------------------------------------------------------

const getMyJobs = async (req, res) => {
  try {

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can access recruiter jobs",
      });
    }


    const jobs = await Job.find({
      recruiterId: req.user._id,
    })
      .sort({
        createdAt: -1,
      })
      .lean();


    return res.status(200).json({
      success: true,
      jobs,
    });

  } catch (error) {

    console.error("Get my jobs error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your jobs",
    });

  }
};


module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
};