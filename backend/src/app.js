const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");

const app = express();


app.use(helmet());


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));

app.use(cookieParser());


//authentication routes

app.use("/api/auth", authRoutes);


app.get("/api/health", (req, res) => {

  res.status(200).json({
    success: true,
    message: "NexHire API is runnig",
  });

});


module.exports = {
  app,
};