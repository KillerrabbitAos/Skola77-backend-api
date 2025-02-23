const { User } = require("../../models");

async function getUserProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email"],
    });
    if (!user) throw new Error("User not found");
    const plainUser = user.get({ plain: true });
    plainUser.avatar = `/uploads/${userId}/pfp.png`;
    return plainUser;
  }

module.exports = getUserProfile;