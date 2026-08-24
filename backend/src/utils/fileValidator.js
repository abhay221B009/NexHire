const path = require("path");


// ------------------------------------------------------------
// PDF VALIDATION
// ------------------------------------------------------------
//
// A PDF file begins with:
//
// %PDF-
//
// We inspect the actual bytes instead of trusting the
// filename or MIME type.
// ------------------------------------------------------------

const isPDF = (buffer) => {

  if (!buffer || buffer.length < 5) {
    return false;
  }

  return (
    buffer.subarray(0, 5).toString() === "%PDF-"
  );
};


// ------------------------------------------------------------
// DOCX VALIDATION
// ------------------------------------------------------------
//
// DOCX is a ZIP-based Office document.
//
// ZIP files begin with:
//
// PK 03 04
//
// We additionally look for DOCX-specific files inside the
// ZIP data:
//
// [Content_Types].xml
// word/document.xml
//
// Their filenames are stored in the ZIP central directory,
// so they can be checked directly from the buffer.
// ------------------------------------------------------------

const isDOCX = (buffer) => {

  if (!buffer || buffer.length < 4) {
    return false;
  }


  // ZIP local file header signature.

  const isZip =
    buffer[0] === 0x50 &&
    buffer[1] === 0x4B &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04;


  if (!isZip) {
    return false;
  }


  // Convert the buffer to a binary string so that we can
  // inspect filenames stored inside the ZIP structure.

  const binary = buffer.toString("latin1");


  const hasContentTypes =
    binary.includes("[Content_Types].xml");


  const hasDocument =
    binary.includes("word/document.xml");


  return hasContentTypes && hasDocument;
};


// ------------------------------------------------------------
// RESUME VALIDATION
// ------------------------------------------------------------

const validateResume = (buffer, originalName) => {

  if (!buffer || !originalName) {

    return {
      valid: false,
      message: "Invalid resume file",
    };
  }


  const extension =
    path.extname(originalName).toLowerCase();


  // ----------------------------------------------------------
  // PDF
  // ----------------------------------------------------------

  if (extension === ".pdf") {

    if (isPDF(buffer)) {

      return {
        valid: true,
        mimeType: "application/pdf",
      };
    }


    return {
      valid: false,
      message: "Invalid PDF file",
    };
  }


  // ----------------------------------------------------------
  // DOCX
  // ----------------------------------------------------------

  if (extension === ".docx") {

    if (isDOCX(buffer)) {

      return {
        valid: true,
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
    }


    return {
      valid: false,
      message: "Invalid DOCX file",
    };
  }


  // ----------------------------------------------------------
  // UNSUPPORTED FILE
  // ----------------------------------------------------------

  return {
    valid: false,
    message: "Only PDF and DOCX files are allowed",
  };
};


module.exports = {
  validateResume,
  isPDF,
  isDOCX,
};