// Load environment variables from .env.
require("dotenv").config();


// Import Supertest so we can make HTTP requests
// against our Express application.
const request = require("supertest");


// Import Mongoose so the test can connect
// to MongoDB Atlas.
const mongoose = require("mongoose");


// Import our Express application.
const { app } = require("../../src/app");


// Import the User model.
const User = require("../../src/models/User");


// Import bcrypt so we can create a real password hash
// for our test user.
const bcrypt = require("bcryptjs");


// ------------------------------------------------------------
// LOGIN AND AUTHENTICATION INTEGRATION TESTS
// ------------------------------------------------------------
//
// These tests verify the complete authentication flow:
//
// Login
//   ↓
// JWT cookie
//   ↓
// Authentication middleware
//   ↓
// Protected /me route
//   ↓
// Logout
//
// ------------------------------------------------------------


describe("Authentication flow", () => {

  // ----------------------------------------------------------
  // CONNECT TO DATABASE
  // ----------------------------------------------------------
  //
  // Connect to the same MongoDB Atlas database
  // used by NexHire.
  //

  beforeAll(async () => {

    await mongoose.connect(process.env.MONGODB_URI);

    // Wait for Mongoose to create the User indexes.
    await User.init();
  });


  // ----------------------------------------------------------
  // CREATE TEST USER
  // ----------------------------------------------------------
  //
  // A fresh test user is created before every test.
  //

  beforeEach(async () => {

    // Create a real bcrypt password hash.
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
  //
  // Remove the test user after every test.
  //

  afterEach(async () => {

    // Only clean up when MongoDB is connected.
    //
    // readyState:
    //
    // 0 = disconnected
    // 1 = connected
    // 2 = connecting
    // 3 = disconnecting

    if (mongoose.connection.readyState === 1) {

      await User.deleteMany({
        email: "login@nexhire.local",
      });
    }
  });


  // ----------------------------------------------------------
  // CLOSE DATABASE CONNECTION
  // ----------------------------------------------------------

  afterAll(async () => {

    await mongoose.connection.close();
  });


  // ==========================================================
  // LOGIN TESTS
  // ==========================================================


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


    // Verify returned user information.

    expect(response.body.user.email)
      .toBe("login@nexhire.local");

    expect(response.body.user.role)
      .toBe("candidate");


    // Password hash must never be returned.

    expect(response.body.user.passwordHash)
      .toBeUndefined();


    // Login should create the authentication cookie.

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


  // ==========================================================
  // PROTECTED /ME TESTS
  // ==========================================================


  // ----------------------------------------------------------
  // AUTHENTICATED USER
  // ----------------------------------------------------------

  test("should return the current authenticated user", async () => {

    // First login to obtain the JWT cookie.

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@nexhire.local",
        password: "StrongPassword123",
      });


    // Extract the authentication cookie.

    const cookie = loginResponse.headers["set-cookie"];


    // Send the cookie to the protected /me route.

    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookie);


    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);


    // Verify the authenticated user's information.

    expect(response.body.user.email)
      .toBe("login@nexhire.local");

    expect(response.body.user.role)
      .toBe("candidate");


    // Password hash must never be exposed.

    expect(response.body.user.passwordHash)
      .toBeUndefined();
  });


  // ----------------------------------------------------------
  // UNAUTHENTICATED USER
  // ----------------------------------------------------------

  test("should reject access to /me without authentication", async () => {

    // No authentication cookie is provided.

    const response = await request(app)
      .get("/api/auth/me");


    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message)
      .toBe("Authentication required");
  });


  // ==========================================================
  // LOGOUT TEST
  // ==========================================================


  // ----------------------------------------------------------
  // SUCCESSFUL LOGOUT
  // ----------------------------------------------------------

  test("should logout successfully", async () => {

    // Login first so we have an authentication cookie.

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@nexhire.local",
        password: "StrongPassword123",
      });


    // Extract the authentication cookie.

    const cookie = loginResponse.headers["set-cookie"];


    // Send the cookie to the logout endpoint.

    const response = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie);


    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message)
      .toBe("Logout successful");


    // The server should send a Set-Cookie header
    // that clears the authentication cookie.

    expect(response.headers["set-cookie"])
      .toBeDefined();
  });

});