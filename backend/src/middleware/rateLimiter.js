const rateLimit = require("express-rate-limit");


// ------------------------------------------------------------
// AUTHENTICATION RATE LIMITER
// ------------------------------------------------------------
//
// Limits repeated requests to authentication endpoints.
//
// This helps protect signup/login endpoints from:
// - brute-force attempts
// - automated abuse
// - excessive requests
// ------------------------------------------------------------

const authLimiter = rateLimit({
  // 15 minute window
  windowMs: 15 * 60 * 1000,

  // Maximum 20 requests during the window
  max: 20,

  // Send standard rate-limit headers
  standardHeaders: true,

  // Disable older X-RateLimit-* headers
  legacyHeaders: false,
});


module.exports = {
  authLimiter,
};