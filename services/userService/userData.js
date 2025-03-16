const { User } = require("../../models");
const updateUserEntities = require("./updateUserEntities");

async function getUsers() {
  return 
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
      console.log(user.data)
      const parsedData = JSON.parse(user.data)
      if (parsedData && typeof parsedData === 'object' && 'klasser' in parsedData && 'klassrum' in parsedData && 'placeringar' in parsedData) {
        await updateUserEntities(newUser.id, parsedData);
      }
      
    }
  }
  return "succeded";
}

module.exports = updateUsers