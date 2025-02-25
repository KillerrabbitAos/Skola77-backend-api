const createServer = require("./start");
const logger = require("./logger")
const config = require("./config/server");

const protocol = config.https ? "https" : "http";

const app = createServer({
  port: 5051,
  corsOrigin: protocol + "://" + config.domain + ":" + config.port,
  noStart: config.noStart,
});

app.listen(5051, () => {
  logger.handleServerStart();
});