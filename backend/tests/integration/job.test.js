require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../src/app");
const User = require("../../src/models/User");
const Job = require("../../src/models/Job");
const Application = require("../../src/models/Application");

const recruiterA = {
  name: "Recruiter A",
  email: "recruiter-a@nexhire.local",
  password: "TestPassword123!",
  role: "recruiter",
};

const recruiterB = {
  name: "Recruiter B",
  email: "recruiter-b@nexhire.local",
  password: "TestPassword123!",
  role: "recruiter",
};

const candidate = {
  name: "Candidate One",
  email: "candidate-one@nexhire.local",
  password: "TestPassword123!",
  role: "candidate",
};

describe("Job and Application management", () => {
  let recruiterAUser, recruiterBUser, candidateUser;
  let recruiterACookie, recruiterBCookie, candidateCookie;
  let testJob;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.init();
    await Job.init();
    await Application.init();

    await User.deleteMany({
      email: { $in: [recruiterA.email, recruiterB.email, candidate.email] },
    });
    await Job.deleteMany({});
    await Application.deleteMany({});

    // Register test users
    await request(app).post("/api/auth/signup").send(recruiterA);
    await request(app).post("/api/auth/signup").send(recruiterB);
    await request(app).post("/api/auth/signup").send(candidate);

    recruiterAUser = await User.findOne({ email: recruiterA.email });
    recruiterBUser = await User.findOne({ email: recruiterB.email });
    candidateUser = await User.findOne({ email: candidate.email });

    // Login users to get session cookies
    let res = await request(app).post("/api/auth/login").send({
      email: recruiterA.email,
      password: recruiterA.password,
    });
    recruiterACookie = res.headers["set-cookie"];

    res = await request(app).post("/api/auth/login").send({
      email: recruiterB.email,
      password: recruiterB.password,
    });
    recruiterBCookie = res.headers["set-cookie"];

    res = await request(app).post("/api/auth/login").send({
      email: candidate.email,
      password: candidate.password,
    });
    candidateCookie = res.headers["set-cookie"];
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await Application.deleteMany({
        candidateId: candidateUser?._id,
      });
      await Job.deleteMany({
        recruiterId: { $in: [recruiterAUser?._id, recruiterBUser?._id] },
      });
      await User.deleteMany({
        email: { $in: [recruiterA.email, recruiterB.email, candidate.email] },
      });
      await mongoose.connection.close();
    }
  });

  // ----------------------------------------------------------
  // JOB CREATION & ACCESS CONTROL
  // ----------------------------------------------------------

  test("should allow a recruiter to create a job", async () => {
    const response = await request(app)
      .post("/api/jobs")
      .set("Cookie", recruiterACookie)
      .send({
        title: "Senior Node.js Engineer",
        company: "NexHire Core",
        location: "Remote",
        skills: ["Node.js", "Express", "MongoDB"],
        description: "Looking for an experienced Node.js backend developer.",
        experienceLevel: "Senior",
        workMode: "Remote",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.job).toBeDefined();
    expect(response.body.job.title).toBe("Senior Node.js Engineer");

    testJob = response.body.job;
  });

  test("should reject job creation from a candidate", async () => {
    const response = await request(app)
      .post("/api/jobs")
      .set("Cookie", candidateCookie)
      .send({
        title: "Unauthorized Job",
        company: "Fake Corp",
        location: "Noida",
        skills: ["None"],
        description: "Candidate trying to post job",
        experienceLevel: "Junior",
        workMode: "Office",
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("should allow public/candidates to fetch active jobs", async () => {
    const response = await request(app).get("/api/jobs");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.jobs)).toBe(true);
    expect(response.body.jobs.length).toBeGreaterThan(0);
  });

  test("should allow recruiter A to fetch their own jobs", async () => {
    const response = await request(app)
      .get("/api/jobs/recruiter/my-jobs")
      .set("Cookie", recruiterACookie);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.jobs.length).toBe(1);
  });

  test("should prevent recruiter B from updating recruiter A's job", async () => {
    const response = await request(app)
      .put(`/api/jobs/${testJob._id}`)
      .set("Cookie", recruiterBCookie)
      .send({
        title: "Hacked Job Title",
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("should allow recruiter A to update their own job", async () => {
    const response = await request(app)
      .put(`/api/jobs/${testJob._id}`)
      .set("Cookie", recruiterACookie)
      .send({
        title: "Lead Node.js Engineer",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.job.title).toBe("Lead Node.js Engineer");
  });

  // ----------------------------------------------------------
  // APPLICATION WORKFLOW
  // ----------------------------------------------------------

  test("should allow a candidate to apply for an active job", async () => {
    const response = await request(app)
      .post("/api/applications")
      .set("Cookie", candidateCookie)
      .send({
        jobId: testJob._id,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.application).toBeDefined();
    expect(response.body.application.stage).toBe("Applied");
  });

  test("should prevent duplicate applications from the same candidate", async () => {
    const response = await request(app)
      .post("/api/applications")
      .set("Cookie", candidateCookie)
      .send({
        jobId: testJob._id,
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  test("should allow candidate to retrieve their submitted applications", async () => {
    const response = await request(app)
      .get("/api/applications/my-applications")
      .set("Cookie", candidateCookie);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.applications.length).toBe(1);
  });

  test("should allow recruiter A to view applicants for their job", async () => {
    const response = await request(app)
      .get(`/api/applications/job/${testJob._id}`)
      .set("Cookie", recruiterACookie);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.applications.length).toBe(1);

    const createdApp = response.body.applications[0];
    expect(createdApp.candidateId.email).toBe(candidate.email);
  });

  test("should prevent recruiter B from viewing applicants for recruiter A's job", async () => {
    const response = await request(app)
      .get(`/api/applications/job/${testJob._id}`)
      .set("Cookie", recruiterBCookie);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("should allow recruiter A to update application status", async () => {
    const appResponse = await request(app)
      .get(`/api/applications/job/${testJob._id}`)
      .set("Cookie", recruiterACookie);

    const applicationId = appResponse.body.applications[0]._id;

    const response = await request(app)
      .patch(`/api/applications/${applicationId}/status`)
      .set("Cookie", recruiterACookie)
      .send({
        status: "Shortlisted",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.application.stage).toBe("Shortlisted");
  });

  test("should allow recruiter A to soft-delete their job", async () => {
    const response = await request(app)
      .delete(`/api/jobs/${testJob._id}`)
      .set("Cookie", recruiterACookie);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    // Verify job is no longer listed in active public jobs
    const publicJobs = await request(app).get("/api/jobs");
    const found = publicJobs.body.jobs.find((j) => j._id === testJob._id);
    expect(found).toBeUndefined();
  });
});
