const multer = require("multer");


// ------------------------------------------------------------
// MULTER CONFIGURATION
// ------------------------------------------------------------
//
// Files are temporarily stored in memory.
//
// We will inspect the actual file content before saving it
// permanently to the local uploads/resumes directory.
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

  // We validate the actual file content later.
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});


module.exports = {
  uploadResume,
  MAX_FILE_SIZE,
};