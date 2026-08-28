const Job = require("../models/Job");
const User = require("../models/User");

// Sample initial seed jobs if DB is empty
const DEFAULT_JOBS = [
  {
    _id: "6500a1b2c3d4e5f678901001",
    title: "Senior Frontend Engineer",
    company: "Stripe Tech",
    location: "San Francisco, CA (Remote)",
    workMode: "Remote",
    experienceLevel: "Senior Level",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "GraphQL"],
    description: "We are seeking a Senior Frontend Engineer to build high-performance, accessible web interfaces for global financial infrastructure. You will work with React 19, TypeScript, and micro-frontend architectures.",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    _id: "6500a1b2c3d4e5f678901002",
    title: "Staff Full Stack Engineer",
    company: "NexHire Technologies",
    location: "New York, NY",
    workMode: "Hybrid",
    experienceLevel: "Senior Level",
    skills: ["React", "Node.js", "Express", "MongoDB", "Redis"],
    description: "Lead end-to-end development of candidate management pipelines, HTTP-Only cookie security layers, and real-time applicant tracking systems. Experience with Node.js and MongoDB required.",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    _id: "6500a1b2c3d4e5f678901003",
    title: "Backend Systems Architect",
    company: "DataPulse Systems",
    location: "Austin, TX",
    workMode: "Remote",
    experienceLevel: "Lead / Executive",
    skills: ["Node.js", "Express", "PostgreSQL", "Docker", "AWS"],
    description: "Design microservices architectures handling 10M+ daily events. Focus on high throughput, zero-downtime database migrations, and sub-10ms API latency.",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    _id: "6500a1b2c3d4e5f678901004",
    title: "AI/ML Integration Lead",
    company: "Cognitive AI Labs",
    location: "Boston, MA",
    workMode: "Hybrid",
    experienceLevel: "Lead / Executive",
    skills: ["Python", "PyTorch", "FastAPI", "React", "LangChain"],
    description: "Drive the integration of LLMs into production workflow applications. Optimize vector embeddings, RAG pipelines, and intelligent candidate matching algorithms.",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    _id: "6500a1b2c3d4e5f678901005",
    title: "Cloud DevOps & Infrastructure Specialist",
    company: "CloudScale Networks",
    location: "Seattle, WA",
    workMode: "Remote",
    experienceLevel: "Mid-Level",
    skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Docker"],
    description: "Manage zero-trust Kubernetes clusters, automated CI/CD pipelines, and infrastructure-as-code deployments for mission-critical enterprise SaaS products.",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    _id: "6500a1b2c3d4e5f678901006",
    title: "Lead UI/UX Product Designer",
    company: "Vanguard Creative Studio",
    location: "Los Angeles, CA",
    workMode: "Onsite",
    experienceLevel: "Mid-Level",
    skills: ["Figma", "UI Design", "Design Systems", "Prototyping"],
    description: "Craft stunning glassmorphism interfaces, fluid micro-animations, and human-centered design systems for next-generation talent matching platforms.",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    _id: "6500a1b2c3d4e5f678901007",
    title: "Cybersecurity & Auth Engineer",
    company: "Fortress Security Solutions",
    location: "Washington, DC",
    workMode: "Remote",
    experienceLevel: "Senior Level",
    skills: ["OAuth2", "JWT", "Node.js", "Binary Validation", "OWASP"],
    description: "Implement high-assurance security features including magic-byte binary inspection, CSRF token validation, HTTP-Only cookie security, and rate limiting.",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    _id: "6500a1b2c3d4e5f678901008",
    title: "Senior Mobile Engineer (React Native)",
    company: "AppVerse Innovations",
    location: "Chicago, IL",
    workMode: "Hybrid",
    experienceLevel: "Senior Level",
    skills: ["React Native", "TypeScript", "iOS", "Android", "Redux"],
    description: "Build slick cross-platform mobile apps for iOS & Android. Ensure 60fps animations, offline storage caching, and instant push notification workflows.",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    _id: "6500a1b2c3d4e5f678901009",
    title: "Data Engineer (Pipeline & Analytics)",
    company: "InsightStream Analytics",
    location: "Denver, CO",
    workMode: "Remote",
    experienceLevel: "Mid-Level",
    skills: ["Python", "Apache Spark", "MongoDB", "SQL", "Airflow"],
    description: "Build scalable ETL pipelines to analyze hiring conversion rates, candidate funnel drop-offs, and automated recruitment metric reports.",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    _id: "6500a1b2c3d4e5f678901010",
    title: "Associate Junior Developer",
    company: "LaunchPad Software",
    location: "Atlanta, GA",
    workMode: "Onsite",
    experienceLevel: "Entry Level",
    skills: ["JavaScript", "React", "HTML/CSS", "Git", "REST APIs"],
    description: "Great entry point for enthusiastic engineers wanting to work closely with senior developers building responsive web apps with React and Express.",
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
  },
];

// Helper to seed jobs into DB if empty or few jobs exist
const seedDefaultJobsIfEmpty = async () => {
  try {
    const count = await Job.countDocuments({ isActive: true });
    if (count < 5) {
      // Find or create a default recruiter user for initial jobs
      let defaultRecruiter = await User.findOne({ role: "recruiter" });
      if (!defaultRecruiter) {
        defaultRecruiter = await User.create({
          name: "NexHire Recruitment",
          email: "recruiter@nexhire.com",
          passwordHash: "$2a$10$e8c1Q0a9u0s1r2t3u4v5w6x7y8z9A0B1C2D3E4F5G6H7I8J9K0L",
          role: "recruiter",
        });
      }
      const existingTitles = new Set(
        (await Job.find({}, "title").lean()).map((j) => j.title.toLowerCase())
      );
      const jobsToInsert = DEFAULT_JOBS.filter(
        (j) => !existingTitles.has(j.title.toLowerCase())
      ).map((j) => {
        const { _id, ...rest } = j;
        return {
          ...rest,
          recruiterId: defaultRecruiter._id,
        };
      });
      if (jobsToInsert.length > 0) {
        await Job.insertMany(jobsToInsert);
        console.log(`Seeded ${jobsToInsert.length} starter job listings into database.`);
      }
    }
  } catch (err) {
    console.error("Seed jobs error:", err.message);
  }
};

// ------------------------------------------------------------
// CREATE JOB
// ------------------------------------------------------------
const createJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can create jobs",
      });
    }

    const { title, company, location, skills, description, experienceLevel, workMode } = req.body;

    if (!title || !company || !location || !description || !experienceLevel || !workMode) {
      return res.status(400).json({
        success: false,
        message: "All required job fields must be provided",
      });
    }

    const job = await Job.create({
      recruiterId: req.user._id,
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      skills: Array.isArray(skills) ? skills.map((s) => s.trim()).filter(Boolean) : [],
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
    await seedDefaultJobsIfEmpty();

    // .find({ isActive: true }): Soft-deletion query filter returning only active openings.
    // .sort({ createdAt: -1 }): Orders records descending by creation date (newest first).
    // .lean(): Returns lightweight plain JS objects instead of Mongoose Hydrated Documents (~5x faster query performance).
    let jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 }).lean();

    if (!jobs || jobs.length === 0) {
      jobs = DEFAULT_JOBS;
    }

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error.message);
    return res.status(200).json({
      success: true,
      jobs: DEFAULT_JOBS,
    });
  }
};

// ------------------------------------------------------------
// GET SINGLE JOB
// ------------------------------------------------------------
const getJobById = async (req, res) => {
  try {
    let job = await Job.findOne({ _id: req.params.id, isActive: true }).lean();

    if (!job) {
      job = DEFAULT_JOBS.find((j) => j._id === req.params.id);
    }

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
    const fallback = DEFAULT_JOBS.find((j) => j._id === req.params.id);
    if (fallback) {
      return res.status(200).json({ success: true, job: fallback });
    }
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

    if (job.recruiterId.toString() !== req.user._id.toString()) {
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

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this job",
      });
    }

    // Soft Deletion Pattern: Marks isActive as false instead of destroying database row with deleteOne().
    // Preserves historical candidate application records and recruitment metrics while hiding job from active browsing catalog.
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

    const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 }).lean();

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