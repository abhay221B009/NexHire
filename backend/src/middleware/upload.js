const multer = require("multer");


// ------------------------------------------------------------
// MULTER CONFIGURATION
// ------------------------------------------------------------
//
// Files are temporarily stored in memory.
//
// We do this because the assignment requires us to inspect
// the actual file content before permanently storing it.
//
// After validation, the controller saves the file to:
//
// uploads/resumes/
// ------------------------------------------------------------

const storage = multer.memoryStorage();


// ------------------------------------------------------------
// MAXIMUM FILE SIZE
// ------------------------------------------------------------
//
// Maximum resume size = 5 MB
// ------------------------------------------------------------

const MAX_FILE_SIZE = 5 * 1024 * 1024;


// ------------------------------------------------------------
// MULTER CONFIGURATION
// ------------------------------------------------------------

const uploadResume = multer({

  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,
  },

  // Do not trust the MIME type or extension.
  //
  // Actual file content is checked in fileValidator.js.

  fileFilter: (req, file, cb) => {
    cb(null, true);
  },

});


module.exports = {
  uploadResume,
  MAX_FILE_SIZE,
};