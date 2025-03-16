const { User } = require("../../models");
const updateUserEntities = require("./updateUserEntities");

async function getUsers() {

}

updateUsers = async () => {
  const data = (await getUsers()).users;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const user = data[key];
      newUser = await User.create({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      await updateUserEntities(newUser.id, JSON.parse(user.data))
    }
  }
  return "succeded";
}

module.exports = updateUsers