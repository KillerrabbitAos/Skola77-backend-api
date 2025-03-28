const path = require("path");

module.exports = {
  port: 3000,
  domain: "localhost",
  https: false,
  apiLogPath: path.join(__dirname, "..", "logs", "api.log"),
  frontendLogPath: path.join(__dirname, "..", "logs", "frontend.log"),
};
