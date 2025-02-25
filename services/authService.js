const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { processAndSaveImage } = require("./uploadService");
const logger = require("../logger");

/**
 * Logs in a user by validating credentials and setting a JWT token in the session.
 * @param {Object} options - Options object.
 * @param {string} options.email - The user's email.
 * @param {string} options.password - The user's password.
 * @param {Object} options.session - The session object.
 * @returns {Promise<string>} - Resolves with the JWT token.
 */
const login = async ({ email, password, session }) => {
  if (!email) {
    throw new Error("Email is required");
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  session.token = token;

  // Update last login (fire-and-forget)
  user.update({ lastLogin: new Date() });
  return token;
};

/**
 * Registers a new user, optionally processing an uploaded image.
 * @param {Object} options - Options object.
 * @param {string} options.name - The user's name.
 * @param {string} options.email - The user's email.
 * @param {string} options.password - The user's password.
 * @param {Object} [options.file] - Optional file object for the avatar image.
 * @param {Object} options.session - The session object.
 * @returns {Promise<string>} - Resolves with the JWT token.
 */
const register = async ({ name, email, password, file, session }) => {
  if (!password) {
    throw new Error("Password is required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  if (file) {
    const result = await processAndSaveImage(user.id, file);
    user.avatar = result.imageUrl;
    await user.save();
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  session.token = token;
  logger.handleUserReg(user);
  return token;
};

/**
 * Checks whether the given user has admin privileges.
 * Throws an error if not.
 * @param {Object} user - The user object.
 */
const checkAdmin = (user) => {
  if (!user || !user.isAdmin) {
    throw new Error("Forbidden: Admin access required");
  }
};

/**
 * Processes an image upload for a given user.
 * @param {Object} user - The user object.
 * @param {Object} file - The uploaded file.
 * @returns {Promise<Object>} - Resolves with the result from image processing.
 */
const uploadImage = async (user, file) => {
  if (!file || !user || !user.id) {
    throw new Error("Invalid request");
  }
  const result = await processAndSaveImage(user.id, file);
  return result;
};

module.exports = {
  login,
  register,
  checkAdmin,
  uploadImage,
};
