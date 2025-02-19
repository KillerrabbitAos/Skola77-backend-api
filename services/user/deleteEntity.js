const { Room, SeatingPlan, Group } = require("../../models");

async function deleteEntity(userId, type, id) {
    let entity, entityName;
    if (type === "room") {
      entity = await Room.findOne({ where: { id, ownerId: userId } });
      entityName = "room";
    } else if (type === "seatingplan") {
      entity = await SeatingPlan.findOne({ where: { id, ownerId: userId } });
      entityName = "seatingplan";
    } else if (type === "group") {
      entity = await Group.findOne({ where: { id, ownerId: userId } });
      entityName = "group";
    } else {
      throw new Error("Invalid type");
    }
  
    if (!entity) {
      throw new Error(`${entityName} not found`);
    }
  
    await entity.destroy();
    return entityName;
  }

module.exports = deleteEntity;