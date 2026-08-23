require("dotenv").config();

const request = require("supertest");

const mongoose = require("mongoose");

const { app } = require("../../src/app");

const User = require("../../src/models/User");

const bcrypt = require("bcryptjs");


// ------------------------------------------------------------
// LOGIN INTEGRATION TESTS
// ------------------------------------------------------------

describe("POST /api/auth/login", () => {

  // ----------------------------------------------------------
  // CONNECT TO DATABASE
  // ----------------------------------------------------------

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.init();
  });


  // ----------------------------------------------------------
  // CREATE TEST USER
  // ----------------------------------------------------------

  beforeEach(async () => {

    // Create a real hashed password for the test user.
    const passwordHash = await bcrypt.hash(
      "StrongPassword123",
      12
    );


    await User.create({
      name: "Login Test User",
      email: "login@nexhire.local",
      passwordHash,
      role: "candidate",
    });
  });


  // ----------------------------------------------------------
  // CLEAN TEST USER
  // ----------------------------------------------------------

  afterEach(async () => {

    if (mongoose.connection.readyState === 1) {
      await User.deleteMany({
        email: "login@nexhire.local",
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
  // SUCCESSFUL LOGIN
  // ----------------------------------------------------------

  test("should login with valid credentials", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@nexhire.local",
        password: "StrongPassword123",
      });


    // Login should succeed.
    expect(response.status).toBe(200);


    expect(response.body.success).toBe(true);

    expect(response.body.message)
      .toBe("Login successful");


    // Verify safe user information.
    expect(response.body.user.email)
      .toBe("login@nexhire.local");

    expect(response.body.user.role)
      .toBe("candidate");


    // Password hash must never be returned.
    expect(response.body.user.passwordHash)
      .toBeUndefined();


    // Authentication cookie should be created.
    expect(response.headers["set-cookie"])
      .toBeDefined();
  });


  // ----------------------------------------------------------
  // WRONG PASSWORD
  // ----------------------------------------------------------

  test("should reject an incorrect password", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@nexhire.local",
        password: "WrongPassword123",
      });


    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message)
      .toBe("Invalid email or password");
  });


  // ----------------------------------------------------------
  // NONEXISTENT USER
  // ----------------------------------------------------------

  test("should reject a nonexistent email", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "doesnotexist@nexhire.local",
        password: "StrongPassword123",
      });


    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message)
      .toBe("Invalid email or password");
  });


  // ----------------------------------------------------------
  // MISSING EMAIL
  // ----------------------------------------------------------

  test("should reject login when email is missing", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        password: "StrongPassword123",
      });


    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });


  // ----------------------------------------------------------
  // MISSING PASSWORD
  // ----------------------------------------------------------

  test("should reject login when password is missing", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@nexhire.local",
      });


    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

});