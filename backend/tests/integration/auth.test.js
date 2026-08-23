require("dotenv").config();

const request = require("supertest");

const mongoose = require("mongoose");

const { app } = require("../../src/app");

const User = require("../../src/models/User");


// ------------------------------------------------------------
// SIGNUP INTEGRATION TESTS
// ------------------------------------------------------------

describe("POST /api/auth/signup", () => {


  // ----------------------------------------------------------
  // CONNECT TO DATABASE
  // ----------------------------------------------------------

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.init();
  });


  // ----------------------------------------------------------
  // CLEAN TEST USERS
  // ----------------------------------------------------------

  afterEach(async () => {

    if (mongoose.connection.readyState === 1) {
      await User.deleteMany({
        email: {
          $regex: /@nexhire\.local$/,
        },
      });
    }
  });


  // ----------------------------------------------------------
  // CLOSE DATABASE
  // ----------------------------------------------------------

  afterAll(async () => {
    await mongoose.connection.close();
  });


  // ----------------------------------------------------------
  // SUCCESSFUL SIGNUP
  // ----------------------------------------------------------

  test("should create a candidate account successfully", async () => {

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test Candidate",
        email: "candidate@nexhire.local",
        password: "StrongPassword123",
        role: "candidate",
      });


    // HTTP status should be 201 Created.
    expect(response.status).toBe(201);


    // Response should indicate success.
    expect(response.body.success).toBe(true);


    // Verify returned user information.
    expect(response.body.user.email)
      .toBe("candidate@nexhire.local");

    expect(response.body.user.role)
      .toBe("candidate");


    // Password hash must NEVER be returned.
    expect(response.body.user.passwordHash)
      .toBeUndefined();


    // Verify that an authentication cookie was created.
    expect(response.headers["set-cookie"])
      .toBeDefined();


    // Verify the actual user exists in MongoDB.
    const user = await User.findOne({
      email: "candidate@nexhire.local",
    });


    expect(user).not.toBeNull();


    // Password should be hashed rather than stored as plain text.
    expect(user.passwordHash)
      .not.toBe("StrongPassword123");
  });


  // ----------------------------------------------------------
  // INVALID ROLE
  // ----------------------------------------------------------

  test("should reject an invalid role", async () => {

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "invalid-role@nexhire.local",
        password: "StrongPassword123",
        role: "admin",
      });


    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });


  // ----------------------------------------------------------
  // DUPLICATE EMAIL
  // ----------------------------------------------------------

  test("should reject a duplicate email", async () => {

    const userData = {
      name: "Test Candidate",
      email: "duplicate@nexhire.local",
      password: "StrongPassword123",
      role: "candidate",
    };


    // First signup.
    const firstResponse = await request(app)
      .post("/api/auth/signup")
      .send(userData);


    expect(firstResponse.status).toBe(201);


    // Second signup with the same email.
    const secondResponse = await request(app)
      .post("/api/auth/signup")
      .send(userData);


    expect(secondResponse.status).toBe(409);

    expect(secondResponse.body.success).toBe(false);
  });


  // ----------------------------------------------------------
  // MISSING REQUIRED FIELDS
  // ----------------------------------------------------------

  test("should reject signup when required fields are missing", async () => {

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Incomplete User",
        email: "incomplete@nexhire.local",
      });


    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

});