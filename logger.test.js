const { PassThrough } = require("stream");

jest.mock("fs", () => {
  const actualFs = jest.requireActual("fs");
  const { PassThrough } = require("stream");
  return {
    ...actualFs,
    createWriteStream: jest.fn(() => new PassThrough()),
  };
});

jest.mock("path", () => ({
  join: (...args) => args.join("/"),
}));

jest.mock("./config/server", () => ({
  apiLogPath: "mocked/log/path.log",
}));

const fs = require("fs");
const config = require("./config/server");
const logger = require("./logger");

describe("logger", () => {
  it("should log created user", () => {
    const user = { id: 1, name: "Test User" };
    logger.handleUserRegistration(user);

    expect(fs.createWriteStream).toHaveBeenCalledWith("mocked/log/path.log", {
      flags: "a",
    });
  });

  it("should log created room", () => {
    const room = { id: 101, name: "Test Room" };
    logger.handleRoomCreation(room);

    expect(fs.createWriteStream).toHaveBeenCalledWith("mocked/log/path.log", {
      flags: "a",
    });
  });
});
