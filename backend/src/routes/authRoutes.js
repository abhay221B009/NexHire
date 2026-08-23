const express = require("express");

const {
  signup,
  login,
} = require("../controllers/authController");

const {
  authLimiter,
} = require("../middleware/rateLimiter");

const router = express.Router();


//rate limiting authentication routes

router.use(authLimiter);


//signup route

router.post("/signup", signup);


//login route

router.post("/login", login);


module.exports = router;