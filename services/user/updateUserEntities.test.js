const updateUserEntities = require("./updateUserEntities");

jest.mock("../../models", () => ({
  Room: { findOne: jest.fn(), create: jest.fn() },
  SeatingPlan: { findOne: jest.fn(), create: jest.fn() },
}));

describe("updateUserEntities", () => {
  const userId = 1;
  const jsData = {
    klasser: [],
    klassrum: [],
    placeringar: [],
  };

  beforeEach(() => jest.clearAllMocks());

  it("should throw an error if userId is undefined", async () => {
    await expect(updateUserEntities(undefined, jsData)).rejects.toThrow(
      "userId is required"
    );
  });

  it("should throw an error if jsData is undefined", async () => {
    await expect(updateUserEntities(userId, undefined)).rejects.toThrow(
      "jsData is required"
    );
  });
});
