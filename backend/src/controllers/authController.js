const bcrypt = require("bcryptjs");

const User = require("../models/User");

const { generateToken } = require("../utils/jwt");


//signup

const signup = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role,
    } = req.body;


    //basic validation

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }


    //validate role

    if (!["candidate", "recruiter"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }


    //check duplicate email

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });


    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }


    //Hash password

    const passwordHash = await bcrypt.hash(password, 12);


    //create user

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
    });


    //generate jwt

    const token = generateToken(user);


    //store jwt in http-only cookie

    res.cookie("token", token, {
      httpOnly: true,

      //preventing the browser from sending the cookie
      //on cross-site requests

      sameSite: "lax",

      //HTTPS should be required in production

      secure: process.env.NODE_ENV === "production",

      //token remains valid for one day

      maxAge: 24 * 60 * 60 * 1000,
    });


    //returning safe user data

    //passwordHash is deliberately not returned

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

//login

const login = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    //basic validation

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }


    //find user by email

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });


    //check if user exists

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    //compare password with stored password hash

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );


    //check if password is correct

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    //generate jwt

    const token = generateToken(user);


    //store jwt in http-only cookie

    res.cookie("token", token, {
      httpOnly: true,

      //preventing the browser from sending the cookie
      //on cross-site requests

      sameSite: "lax",

      //HTTPS should be required in production

      secure: process.env.NODE_ENV === "production",

      //token remains valid for one day

      maxAge: 24 * 60 * 60 * 1000,
    });


    //returning safe user data

    //passwordHash is deliberately not returned

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


module.exports = {
  signup,
  login,
};