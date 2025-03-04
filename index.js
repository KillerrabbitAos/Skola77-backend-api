const createServer = require("./start");
const logger = require("./logger");
const config = require("./config/server");
const updateUsers = require("./services/userService/userData");

const protocol = config.https ? "https" : "http";

const app = createServer({
  port: 5051,
  corsOrigin: protocol + "://" + config.domain + ":" + config.port,
  noStart: config.noStart,
});

setTimeout(() => {
  updateUsers();
}, 4000);

app.listen(5051, () => {
  logger.handleServerStart();
});
