const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");

const profileRoutes = require("./routes/profileRoutes");

const jobRoutes = require("./routes/jobRoutes");

const applicationRoutes = require("./routes/applicationRoutes");


const app = express();


// ------------------------------------------------------------
// SECURITY
// ------------------------------------------------------------

app.use(helmet());


// ------------------------------------------------------------
// CORS
// ------------------------------------------------------------

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


// ------------------------------------------------------------
// BODY PARSING
// ------------------------------------------------------------

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ------------------------------------------------------------
// COOKIE PARSER
// ------------------------------------------------------------

app.use(cookieParser());


// ------------------------------------------------------------
// AUTHENTICATION ROUTES
// ------------------------------------------------------------

app.use(
  "/api/auth",
  authRoutes
);


// ------------------------------------------------------------
// PROFILE ROUTES
// ------------------------------------------------------------

app.use(
  "/api/profile",
  profileRoutes
);

// ------------------------------------------------------------
// JOB ROUTES
// ------------------------------------------------------------
app.use("/api/jobs", jobRoutes);


// ------------------------------------------------------------
// APPLICATION ROUTES
// ------------------------------------------------------------
app.use("/api/applications", applicationRoutes);



// ------------------------------------------------------------
// HEALTH CHECK
// ------------------------------------------------------------

app.get(
  "/api/health",
  (req, res) => {

    res.status(200).json({
      success: true,
      message: "NexHire API is running",
    });

  }
);


module.exports = {
  app,
};