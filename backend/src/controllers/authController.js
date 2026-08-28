const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

// Cookie Configuration helper for local & cross-domain deployment (Vercel + Render)
// - httpOnly: Prevents client-side JS (document.cookie) access to mitigate XSS token theft.
// - sameSite: Set to 'none' in prod for cross-site cookie sending between Vercel & Render, 'lax' in dev.
// - secure: Transmits cookie exclusively over encrypted HTTPS in production.
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000, // 1 day session duration
  };
};

// signup
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }

    // validate role
    if (!["candidate", "recruiter"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    // check duplicate email
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // bcrypt.hash(password, 12): Uses 12 salt rounds of key stretching to compute salted password hash, defeating rainbow table attacks.
    const passwordHash = await bcrypt.hash(password, 12);

    // create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
    });

    // generate jwt token containing userId and role claims
    const token = generateToken(user);

    // res.cookie(): Sets token in HTTP-Only response header
    res.cookie("token", token, getCookieOptions());

    // returning safe user data
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create account",
    });
  }
};

// login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // find user by email
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // compare password with stored password hash
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // generate jwt
    const token = generateToken(user);

    // store jwt in http-only cookie
    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

// get current authenticated user
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get current user",
    });
  }
};

// logout
const logout = async (req, res) => {
  try {
    const options = getCookieOptions();
    delete options.maxAge;
    res.clearCookie("token", options);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
};