const express = require("express");

const {
  signup,
  login,
  getMe,
  logout,
} = require("../controllers/authController");

const {
  authLimiter,
} = require("../middleware/rateLimiter");

// Authentication middleware.
// This checks whether the user has a valid JWT cookie.
const authenticate = require("../middleware/auth");

const router = express.Router();


// ------------------------------------------------------------
// RATE LIMITING AUTHENTICATION ROUTES
// ------------------------------------------------------------

router.use(authLimiter);


// ------------------------------------------------------------
// SIGNUP ROUTE
// ------------------------------------------------------------

router.post("/signup", signup);


// ------------------------------------------------------------
// LOGIN ROUTE
// ------------------------------------------------------------

router.post("/login", login);


// ------------------------------------------------------------
// GET CURRENT USER
// ------------------------------------------------------------
//
// This route is protected.
//
// authenticate runs first and verifies the JWT.
// If authentication succeeds, getMe handles the request.
//

router.get("/me", authenticate, getMe);


// ------------------------------------------------------------
// LOGOUT ROUTE
// ------------------------------------------------------------

router.post("/logout", logout);


module.exports = router;