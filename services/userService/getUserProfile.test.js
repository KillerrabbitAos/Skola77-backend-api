const { sequelize, User } = require("../../models");

const getUserProfile = require("./getUserProfile");

describe("getUserProfile", () => {
  let mockFindByPk;

  beforeEach(() => {
    mockFindByPk = jest.fn(); // Create a fresh mock before each unit test
    jest.spyOn(User, "findByPk").mockImplementation(mockFindByPk);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clears all mocks after each unit test
  });

  afterAll(() => {
    User.findByPk.mockRestore();
  });

  it("should return user profile with avatar path", async () => {
    const mockUser = {
      get: jest.fn().mockReturnValue({
        id: 1,
        name: "Alice",
        email: "alice@example.com",
      }),
    };

    mockFindByPk.mockResolvedValue(mockUser); // Mock return value

    const result = await getUserProfile(1);

    expect(result).toEqual({
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      avatar: "/uploads/1/pfp.png",
    });

    expect(mockFindByPk).toHaveBeenCalledWith(1, {
      attributes: ["id", "name", "email"],
    });
  });

  it("should throw an error if user is not found", async () => {
    mockFindByPk.mockResolvedValue(null);

    await expect(getUserProfile(999)).rejects.toThrow("User not found");
  });
});
