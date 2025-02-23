const { User } = require("../../models");
const getNiceUserData = require("../user/helpers/getNiceUserData");

async function getUserAccess(userId) {
  const user = await User.findByPk(userId);
  const userData = await getNiceUserData(userId);
  return { userData, user };
}

module.exports = getUserAccess;
