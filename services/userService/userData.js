const { User } = require("../../models");
const updateUserEntities = require("./updateUserEntities");



updateUsers = async () => {
  const data = getUsers();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const user = data[key];
      newUser = await User.create({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      console.log(newUser.id, JSON.parse(user.data));
    }
  }
  return "succeded";
}

module.exports = updateUsers