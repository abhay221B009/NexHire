require("dotenv").config();

const jwt = require("jsonwebtoken");
const authenticate = require("../../src/middleware/auth");
const User = require("../../src/models/User");


// ------------------------------------------------------------
// AUTHENTICATION MIDDLEWARE TESTS
// ------------------------------------------------------------

describe("Authentication middleware", () => {

  // ----------------------------------------------------------
  // TEST 1 — NO TOKEN
  // ----------------------------------------------------------

  test("should reject a request without an authentication cookie", async () => {

    const req = {
      cookies: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();


    await authenticate(req, res, next);


    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Authentication required",
    });

    expect(next).not.toHaveBeenCalled();
  });


  // ----------------------------------------------------------
  // TEST 2 — INVALID TOKEN
  // ----------------------------------------------------------

  test("should reject an invalid authentication token", async () => {

    const req = {
      cookies: {
        token: "invalid-token",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();


    await authenticate(req, res, next);


    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid or expired authentication token",
    });

    expect(next).not.toHaveBeenCalled();
  });


  // ----------------------------------------------------------
  // TEST 3 — VALID TOKEN + EXISTING USER
  // ----------------------------------------------------------

  test("should authenticate a valid token and attach the user", async () => {

    // Fake user returned by MongoDB.
    const fakeUser = {
      _id: "507f1f77bcf86cd799439011",
      name: "Test Candidate",
      email: "candidate@nexhire.local",
      role: "candidate",
    };


    // Create a valid JWT containing the user's ID.
    const token = jwt.sign(
      {
        userId: fakeUser._id,
        role: fakeUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );


    // Mock the User query.
    //
    // Our real middleware uses:
    //
    // User.findById(...).select("-passwordHash")
    //
    // so the mock needs to support that chain.
    const selectMock = jest.fn().mockResolvedValue(fakeUser);

    jest.spyOn(User, "findById").mockReturnValue({
      select: selectMock,
    });


    const req = {
      cookies: {
        token,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();


    await authenticate(req, res, next);


    // Verify that MongoDB was queried using the ID
    // contained inside the JWT.
    expect(User.findById).toHaveBeenCalledWith(fakeUser._id);


    // Verify passwordHash was excluded.
    expect(selectMock).toHaveBeenCalledWith("-passwordHash");


    // Verify authenticated user was attached to request.
    expect(req.user).toEqual(fakeUser);


    // Verify middleware allowed the request to continue.
    expect(next).toHaveBeenCalledTimes(1);


    // Restore the original User.findById implementation.
    User.findById.mockRestore();
  });
});