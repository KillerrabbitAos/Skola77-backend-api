// middleware.js
const multer = require('multer');
const path = require('path');

// Configure multer storage (for file uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Use timestamp in the filename to avoid conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Create multer instance to handle multipart form-data
const upload = multer({ storage: storage });

// Custom middleware for handling multipart form-data
function multipartFormDataParser(req, res, next) {
  upload.any()(req, res, (err) => {
    if (err) {
      // Handle any errors during the upload process
      return res.status(400).json({ error: err.message });
    }
    // Proceed to the next middleware or route handler
    next();
  });
}

module.exports = multipartFormDataParser;
