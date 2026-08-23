// Load environment variables.
require("dotenv").config();


// Import the functions we are testing.
const {
  generateToken,
  verifyToken,
} = require("../../src/utils/jwt");


// ------------------------------------------------------------
// JWT TESTS
// ------------------------------------------------------------

describe("JWT utilities", () => {

  test("should generate and verify a valid JWT", () => {

    // Fake user used only for testing.
    const user = {
      _id: "507f1f77bcf86cd799439011",
      role: "candidate",
    };


    // Generate the token.
    const token = generateToken(user);


    // A JWT is a string containing three sections.
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);


    // Verify the token.
    const decoded = verifyToken(token);


    // Verify that our payload survived the round trip.
    expect(decoded.userId).toBe(user._id);
    expect(decoded.role).toBe("candidate");
  });


  test("should reject an invalid JWT", () => {

    // An intentionally invalid token.
    const invalidToken = "invalid.jwt.token";


    // Verification should throw an error.
    expect(() => {
      verifyToken(invalidToken);
    }).toThrow();
  });
});