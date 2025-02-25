const createServer = require("./start");

const config = require("./config/server");

const protocol = config.https ? "https" : "http";

createServer({
  port: 5051,
  corsOrigin: protocol + "://" + config.domain + ":" + config.port,
  noStart: config.noStart,
});