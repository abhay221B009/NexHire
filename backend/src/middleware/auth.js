
const User = require("../models/User");


 
const { verifyToken } = require("../utils/jwt");


// ------------------------------------------------------------
// AUTHENTICATION MIDDLEWARE


const authenticate = async (req, res, next) => {
  try {

    // Read JWT from HTTP-Only cookie parsed by cookie-parser middleware.
    const token = req.cookies?.token;


    // If there is no token, the user is not authenticated.
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }


    // verifyToken(): Decodes JWT and verifies signature against JWT_SECRET.
    const decoded = verifyToken(token);


    // .select("-passwordHash"): Mongoose field exclusion preventing sensitive password hash bytes from attaching to req.user.
    const user = await User.findById(decoded.userId)
      .select("-passwordHash");


    // The token could be valid while the user account has
    // subsequently been deleted.
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found",
      });
    }


    // Attach the authenticated user to the request.
     
    req.user = user;


    // Continue to the next middleware/controller.
    next();

  } catch (error) {

    // JWT errors include expired or malformed tokens.
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};


// Export the middleware.
module.exports = authenticate;