// Import Node's built-in DNS module.
//
// MongoDB Atlas uses mongodb+srv:// connection strings,
// which require SRV DNS lookups.
const dns = require("dns");


// ------------------------------------------------------------
// DNS CONFIGURATION
// ------------------------------------------------------------
//
// On this machine, Node's default DNS resolver was using:
//
// 127.0.0.1
//
// That resolver was refusing MongoDB Atlas SRV queries.
//
// Public DNS resolvers successfully resolve the Atlas SRV
// records, so we configure Node to use them.
//
// Google DNS: 8.8.8.8
// Cloudflare DNS: 1.1.1.1
// ------------------------------------------------------------

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);


// Exporting the configured dns module isn't strictly necessary,
// but it makes this module easy to import during application
// startup and testing.
module.exports = dns;