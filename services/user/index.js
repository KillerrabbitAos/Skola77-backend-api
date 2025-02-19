const getUserAccess = require("./getUserAccess");
const createOrganization = require("./createOrganization");
const shareEntityWithUsers = require("./shareEntityWithUsers");
const updateUserEntities = require("./updateUserEntities");
const createEntity = require("./createEntity");
const deleteEntity = require("./deleteEntity");
const search = require("./search");
const getUserProfile = require("./getUserProfile");

const userServices = {
    getUserAccess,
    createOrganization,
    shareEntityWithUsers,
    updateUserEntities,
    createEntity,
    deleteEntity,
    search,
    getUserProfile,
};

module.exports = userServices;