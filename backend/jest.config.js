module.exports = {
  // Run integration tests in Node's environment.
  testEnvironment: "node",

  // Load this file before Jest starts executing tests.
  //
  // This ensures our DNS configuration is applied before
  // Mongoose attempts to connect to MongoDB Atlas.
  setupFiles: [
    "<rootDir>/src/config/dns.js",
  ],

  // Jest normally waits 5 seconds for hooks/tests.
  //
  // Atlas connections can occasionally take longer, so we
  // give integration tests a little more time.
  testTimeout: 15000,
};