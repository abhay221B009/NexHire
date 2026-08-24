const mongoose = require("mongoose");


// ------------------------------------------------------------
// JOB SCHEMA
// ------------------------------------------------------------
//
// Represents a job posted by a recruiter.
//
// A job contains information such as:
// - recruiter
// - title
// - company
// - location
// - required skills
// - description
// - experience level
// - work mode
// - active/inactive status
// ------------------------------------------------------------

const jobSchema = new mongoose.Schema(
  {
    // --------------------------------------------------------
    // RECRUITER WHO CREATED THE JOB
    // --------------------------------------------------------

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },


    // --------------------------------------------------------
    // JOB TITLE
    // --------------------------------------------------------

    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 150,
    },


    // --------------------------------------------------------
    // COMPANY
    // --------------------------------------------------------

    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 150,
    },


    // --------------------------------------------------------
    // LOCATION
    // --------------------------------------------------------

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      index: true,
    },


    // --------------------------------------------------------
    // REQUIRED SKILLS
    // --------------------------------------------------------

    skills: {
      type: [String],
      default: [],
      index: true,
    },


    // --------------------------------------------------------
    // JOB DESCRIPTION
    // --------------------------------------------------------

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },


    // --------------------------------------------------------
    // EXPERIENCE LEVEL
    // --------------------------------------------------------

    experienceLevel: {
      type: String,
      required: true,
      trim: true,
    },


    // --------------------------------------------------------
    // WORK MODE
    // --------------------------------------------------------

    workMode: {
      type: String,
      enum: ["Office", "Hybrid", "Remote"],
      required: true,
    },


    // --------------------------------------------------------
    // ACTIVE / INACTIVE
    // --------------------------------------------------------

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },

  {
    timestamps: true,
  }
);


// ------------------------------------------------------------
// INDEX
// ------------------------------------------------------------

jobSchema.index({
  isActive: 1,
  createdAt: -1,
});


// ------------------------------------------------------------
// MODEL
// ------------------------------------------------------------

const Job = mongoose.model("Job", jobSchema);


module.exports = Job;