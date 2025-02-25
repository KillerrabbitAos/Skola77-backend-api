const config = require("./config/server");
const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const apiLogStream = fs.createWriteStream(config.apiLogPath, { flags: "a" });
const apiErrorStream = fs.createWriteStream(config.apiLogPath, { flags: "a" });

const out = apiLogStream;
const err = apiErrorStream;

const apiConsole = new console.Console(out, err);


module.exports = {
  handleUserReg: (user) => {
    apiConsole.log("New user registered: ", {password: "excluded", ...user});
  },

  handleRoomCreation: (room) => {
    apiConsole.log("New room created: ", {jsData: "excluded", ...room});
  },

  handleDbSyncError: (error) => {
    apiConsole.error("Error syncing database:", error);
  },
};
