const express = require("express");

const { signup } = require("../controllers/authController");

const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();


//rate limiting authentication routes

router.use(authLimiter);


//signup route

router.post("/signup", signup);


module.exports = router;