const mongoose = require("mongoose");


// ------------------------------------------------------------
// JOB SCHEMA
// ------------------------------------------------------------
//
// Represents a job posted by a recruiter.
//
// A job contains information such as:
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
    // Job title
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 150,
    },


    // Company offering the position
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 150,
    },


    // Job location
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      index: true,
    },


    // Skills required for the job
    skills: {
      type: [String],
      default: [],
      index: true,
    },


    // Description of the position
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },


    // Required experience level
    experienceLevel: {
      type: String,
      required: true,
      trim: true,
    },


    // Work arrangement
    workMode: {
      type: String,
      enum: ["Office", "Hybrid", "Remote"],
      required: true,
    },


    // Allows recruiters to disable a job
    // without deleting it.
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },

  {
    // Automatically creates:
    //
    // createdAt
    // updatedAt
    timestamps: true,
  }
);


// ------------------------------------------------------------
// INDEX
// ------------------------------------------------------------
//
// Makes active-job listings sorted by newest first
// more efficient.
//
// 1  = ascending
// -1 = descending
// ------------------------------------------------------------

jobSchema.index({
  isActive: 1,
  createdAt: -1,
});


// ------------------------------------------------------------
// MODEL
// ------------------------------------------------------------

const Job = mongoose.model("Job", jobSchema);


// Export the Mongoose model.
module.exports = Job;