const mongoose = require("mongoose");


const candidateProfileSchema = new mongoose.Schema(
  {

    // --------------------------------------------------------
    // USER REFERENCE
    // --------------------------------------------------------

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },


    // --------------------------------------------------------
    // PHONE
    // --------------------------------------------------------

    phone: {
      type: String,
      trim: true,
    },


    // --------------------------------------------------------
    // LOCATION
    // --------------------------------------------------------

    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },


    // --------------------------------------------------------
    // PROFESSIONAL BIO
    // --------------------------------------------------------

    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
    },


    // --------------------------------------------------------
    // SKILLS
    // --------------------------------------------------------

    skills: {
      type: [String],
      default: [],
    },


    // --------------------------------------------------------
    // EXPERIENCE
    // --------------------------------------------------------

    experience: {
      type: Number,
      min: 0,
      max: 50,
      default: 0,
    },


    // --------------------------------------------------------
    // EDUCATION
    // --------------------------------------------------------

    education: {
      type: String,
      trim: true,
      maxlength: 500,
    },


    // --------------------------------------------------------
    // RESUME
    // --------------------------------------------------------

    resume: {
      type: {
        originalName: {
          type: String,
          trim: true,
        },

        storedName: {
          type: String,
          trim: true,
        },

        path: {
          type: String,
          trim: true,
        },

        mimeType: {
          type: String,
          trim: true,
        },

        size: {
          type: Number,
        },
      },
      default: undefined,
    },


    // --------------------------------------------------------
    // PROFILE COMPLETION
    // --------------------------------------------------------

    completePercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

  },

  {
    timestamps: true,
  }
);


const CandidateProfile = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema
);


module.exports = CandidateProfile;