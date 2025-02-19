const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|webp/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed!"),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

/**
 * Processes and saves an image for a user.
 *
 * @param {string} userId - The ID of the user.
 * @param {Object} image - The image file to be processed and saved.
 * @param {Buffer} image.buffer - The buffer of the image file.
 * @throws {Error} If no image is provided or if the image is invalid.
 * @returns {Promise<Object>} An object containing the filename and image URL.
 */
const processAndSaveImage = async (userId, image) => {
  if (!image) throw new Error("No image provided");

  const isValidFile = new Promise((resolve, reject) => {
    fileFilter(null, image, (error, success) => {
      if (error) reject(error);
      else resolve(success);
    });
  });

  await isValidFile;

  const uploadPath =
    process.env.UPLOAD_PATH || path.join(__dirname, "../uploads");
  const userFolder = path.join(uploadPath, userId.toString());
  fs.mkdirSync(userFolder, { recursive: true });

  const filePath = path.join(userFolder, "pfp.png");

  await sharp(image.buffer).toFormat("png").toFile(filePath);

  return { filename: "pfp.png", imageUrl: `/uploads/${userId}/pfp.png` };
};

module.exports = { processAndSaveImage };
