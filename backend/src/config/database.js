// Import Mongoose.
//
// Mongoose allows our Node.js application to connect
// to MongoDB and work with our MongoDB models.
const mongoose = require("mongoose");


// ------------------------------------------------------------
// CONNECT TO DATABASE
// ------------------------------------------------------------
//
// This function establishes the connection between
// NexHire and MongoDB.
//
// The MongoDB connection string is stored in our .env file.
//
// Example:
//
// MONGODB_URI=mongodb://127.0.0.1:27017/nexhire
// ------------------------------------------------------------

const connectDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || (process.env.NODE_ENV !== "production" ? "mongodb://127.0.0.1:27017/nexhire" : null);

    if (!uri) {
      throw new Error(
        "MONGODB_URI environment variable is missing! Please set MONGODB_URI in your Render Environment Variables dashboard."
      );
    }

    // Connect to MongoDB using the connection string
    await mongoose.connect(uri);

    // This confirms that the database connection succeeded.
    console.log("MongoDB connected successfully");

  } catch (error) {

    // Display the reason why the connection failed.
    console.error("MongoDB connection failed:", error.message);

    // NexHire cannot function without its database,
    // so we stop the application.
    process.exit(1);
  }
};


// Export the function.
//
// server.js imports it using:
//
// const connectDatabase = require("./config/database");
module.exports = connectDatabase;