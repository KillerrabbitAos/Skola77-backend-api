const { Room, SeatingPlan, Group, User } = require("../../models");

function getEntityNameAndInstance(type, entityId) {
  if (type === "room") {
    return [Room.findByPk(entityId), "Room"];
  } else if (type === "seatingplan") {
    return [SeatingPlan.findByPk(entityId), "Seating plan"];
  } else if (type === "group") {
    return [Group.findByPk(entityId), "Group"];
  }
}

async function shareEntityWithUsers(
  userId,
  type,
  entityId,
  userIds,
  permissions
) {
  const [entity, entityName] = getEntityNameAndInstance(type, entityId);

  if (!entity) {
    throw new Error(`${entityName} not found`);
  }
  if (entity.ownerId !== userId) {
    throw new Error(
      `You are not the owner of this ${entityName.toLowerCase()}`
    );
  }

  if (!Array.isArray(userIds)) {
    userIds = [userIds];
  }
  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }
  if (userIds.length === 0) {
    throw new Error("Invalid parameters: userIds is empty");
  }

  const usersToShareWith = await User.findAll({
    where: { id: userIds },
  });

  if (usersToShareWith.length !== userIds.length) {
    throw new Error("One or more users not found");
  }

  for (let index = 0; index < usersToShareWith.length; index++) {
    const permission = permissions[index];
    await entity.addUser(usersToShareWith[index].id, {
      through: { permission },
    });
  }

  return { entity, sharedWith: usersToShareWith };
}

module.exports = shareEntityWithUsers;
