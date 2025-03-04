const { updateUserEntities } = require("./updateUserEntities");
const { User } = require("../../models");
const {getUsers} = import("./userData");

const data = getUsers();
console.log(data);

async function convertUsers(users) {
    users.map(async (user) => {
        User.Create(user);
        await updateUserEntities(id, jsData);
    });
}
convertUsers(data);