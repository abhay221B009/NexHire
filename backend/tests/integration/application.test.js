// Load environment variables from .env.
// Jest runs independently from our normal server,
// so we need to load the environment here as well.
require("dotenv").config();


// Import Mongoose so the test can connect to MongoDB.
const mongoose = require("mongoose");


// Import the models we need for this test.
const {
  User,
  Job,
  Application,
} = require("../../src/config/models");


// ------------------------------------------------------------
// APPLICATION DATABASE CONSTRAINT TEST
// ------------------------------------------------------------
//
// Business rule:
//
// A candidate can apply to a particular job only once.
//
// This rule is enforced by the MongoDB compound unique index:
//
// candidateId + jobId
//
// We're testing the actual database constraint here rather
// than simply testing JavaScript validation.
// ------------------------------------------------------------

describe("Application database constraints", () => {

  let candidate;
  let job;


  // ----------------------------------------------------------
  // CONNECT TO DATABASE
  // ----------------------------------------------------------
  //
  // Run once before all tests.
  // ----------------------------------------------------------

  beforeAll(async () => {

    // Connect to the same MongoDB Atlas database
    // used by NexHire.
    await mongoose.connect(process.env.MONGODB_URI);


    // Wait for Mongoose to finish creating the indexes.
    //
    // This is important because our duplicate-application
    // protection depends on a unique index.
    await Application.init();
  });


  // ----------------------------------------------------------
  // CLEAN TEST DATA
  // ----------------------------------------------------------

afterEach(async () => {

  // Only attempt cleanup if Mongoose is actually
  // connected to MongoDB.
  //
  // readyState === 1 means:
  // 0 = disconnected
  // 1 = connected
  // 2 = connecting
  // 3 = disconnecting
  if (mongoose.connection.readyState === 1) {

    // Remove the test application.
    await Application.deleteMany({});

    // Remove the test candidate.
    await User.deleteMany({});

    // Remove the test job.
    await Job.deleteMany({});
  }
});

  // ----------------------------------------------------------
  // CLOSE DATABASE CONNECTION
  // ----------------------------------------------------------

  afterAll(async () => {

    // Close the MongoDB connection after all tests finish.
    await mongoose.connection.close();
  });


  // ----------------------------------------------------------
  // TEST DUPLICATE APPLICATION
  // ----------------------------------------------------------

  test(
    "should prevent a candidate from applying to the same job twice",
    async () => {

      // Create a test candidate.
      candidate = await User.create({
        name: "Test Candidate",
        email: "candidate-test@nexhire.local",
        passwordHash: "test-password-hash",
        role: "candidate",
      });


      // Create a test job.
      job = await Job.create({
        recruiterId: new mongoose.Types.ObjectId(),
        title: "Frontend Developer",
        company: "NexTech",
        location: "Noida",
        skills: ["React", "JavaScript"],
        description: "Frontend developer position",
        experienceLevel: "Fresher",
        workMode: "Hybrid",
      });


      // ------------------------------------------------------
      // FIRST APPLICATION
      // ------------------------------------------------------
      //
      // This should succeed because the candidate hasn't
      // applied to this job before.
      await Application.create({
        candidateId: candidate._id,
        jobId: job._id,
      });


      // ------------------------------------------------------
      // SECOND APPLICATION
      // ------------------------------------------------------
      //
      // The candidate is trying to apply to the SAME job again.
      //
      // MongoDB's unique compound index should reject this.
      await expect(
        Application.create({
          candidateId: candidate._id,
          jobId: job._id,
        })
      ).rejects.toThrow();
    }
  );
});