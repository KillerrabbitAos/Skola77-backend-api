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

function withTimestamp(fn) {
  return async (...args) => {
    const dateTime = new Date().toLocaleString();
    apiConsole.log("\n", `[${dateTime}]`);
    return await fn(...args);
  };
}

function addTimestampsToModule(module) {
  Object.keys(module).forEach((key) => {
    if (typeof module[key] === "function") {
      module[key] = withTimestamp(module[key]);
    }
  });
  return module;
}

const handlers = {
  handleServerStart: () => {
    apiConsole.log("Server started");
  },

  handleUserReg: async (user) => {
    const userInfo = await user.get({ plain: true });
    userInfo.password = "excluded";
    apiConsole.log("New user registered: ", userInfo);
  },

  handleRoomCreation: (room) => {
    apiConsole.log("New room created: ", { jsData: "excluded", ...room });
  },

  handleDbSyncError: (error) => {
    apiConsole.error("Error syncing database:", error);
  },
};

module.exports = addTimestampsToModule(handlers);
