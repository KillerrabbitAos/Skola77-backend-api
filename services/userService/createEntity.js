const { User, Room, SeatingPlan, Group } = require("../../models");

async function createEntity(userId, type, name, jsData) {
    let entity, entityName;
    const user = await User.findByPk(userId);
    if (type === "room") {
      entity = await Room.create({ name, jsData, ownerId: userId });
      entityName = "room";
      if (user) await user.addRoom(entity);
    } else if (type === "seatingplan") {
      entity = await SeatingPlan.create({ name, jsData, ownerId: userId });
      entityName = "seatingplan";
      if (user) await user.addSeatingPlan(entity);
    } else if (type === "group") {
      entity = await Group.create({ name, jsData, ownerId: userId });
      entityName = "group";
      if (user) await user.addGroup(entity);
    } else {
      throw new Error("Invalid type");
    }
    return { entity, entityName };
  }

module.exports = createEntity;