const { sequelize, User } = require("../../models");
const getUserProfile = require("./getUserProfile");

describe("getUserProfile", () => {
  describe("Unit Tests", () => {
    let mockFindByPk;

    beforeEach(() => {
      mockFindByPk = jest.fn(); // Create a fresh mock before each unit test
      jest.spyOn(User, 'findByPk').mockImplementation(mockFindByPk);
    });

    afterEach(() => {
      jest.clearAllMocks(); // Clears all mocks after each unit test
    });

    afterAll(() => {
      User.findByPk.mockRestore();
    })
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
      mockFindByPk.mockResolvedValue(null); // Mock non-existent user

      await expect(getUserProfile(999)).rejects.toThrow("User not found");
    });
  });

  describe("Integration Tests", () => {
    beforeAll(async () => {
      jest.resetAllMocks(); // Reset mocks before running integration tests
      jest.resetModules(); // Clear require cache for clean environment

      await sequelize.sync({ force: true }); // Sync the database with force option to reset it
    });

    afterEach(async () => {
      // Clean up any database changes made during integration tests
      await User.destroy({ where: {} }); // Remove the test user, if created
    });

    afterAll(async () => {
      await sequelize.close(); // Close sequelize connection after all tests
    });

    it("should throw error 'User not found' if there aren't any users", async () => {
      await expect(getUserProfile(2)).rejects.toThrow("User not found");
    });

    it("should fetch a real user from the database if there is one", async () => {
      // Ensure no user exists before creating one
      const existingUsers = await User.findAll();
      expect(existingUsers.length).toBe(0); // Ensure no user exists

      const newUser = await User.create({
        name: "Bob",
        email: "bob@example.com",
      });

      // Fetch the user's profile
      const result = await getUserProfile(newUser.id);

      expect(result).toEqual({
        id: newUser.id,
        name: "Bob",
        email: "bob@example.com",
        avatar: `/uploads/${newUser.id}/pfp.png`,
      });
    });

    it("should return an error for non-existent user", async () => {
      await expect(getUserProfile(999)).rejects.toThrow("User not found");
    });
  });
});
