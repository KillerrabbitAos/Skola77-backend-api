const {
  Group,
  Room,
  SeatingPlan,
  UserRoom,
  UserGroup,
  UserSeatingPlan,
  User,
} = require("../../models");
const getNiceUserData = require("./helpers/getNiceUserData");

function checkIfSpecial(id) {
  return !Number.isInteger(id) && id.toString().length > 5;
}

/**
 * Maps new IDs to the given entity's "jsData" and updates the corresponding database record.
 *
 * @param {Object} entity - The room, group, or seating plan entity to be updated.
 * @param {string} type - The type of the entity, which can be "group", "room", or any other type that defaults to SeatingPlan.
 * @returns {Promise<void>} - A promise that resolves when the update operation is complete.
 */
async function mapNewIds(entity, type) {
  if (!entity || !entity.jsData) {
    console.error("Invalid entity or missing jsData:", entity);
    return;
  }
  const oldJsData = JSON.parse(entity.jsData);
  const newJsData = { ...oldJsData, id: entity.id };

  const Model = type === "group" ? Group : type === "room" ? Room : SeatingPlan;
  await Model.update(
    { jsData: JSON.stringify(newJsData) },
    { where: { id: entity.id } }
  );
}

/**
 * Upserts a group for a given user. If the group already exists, it updates the existing group.
 * Otherwise, it creates a new group.
 *
 * @param {number} userId - The ID of the user who owns the group.
 * @param {Object} group - The group object to be upserted.
 * @param {number|string} group.id - The ID of the group. If it's not an integer and its string length is greater than 5, it's considered a special ID.
 * @param {string} group.namn - The name of the group.
 * @param {Array} group.personer - The list of persons in the group.
 * @returns {Promise<Object>} - The upserted group object.
 */
async function upsertGroup(userId, group) {
  const isSpecialId = checkIfSpecial(group.id);
  if (!isSpecialId) {
    const query =
      group.owner !== "you"
        ? {
            where: { id: group.id },
            include: {
              model: User,
              as: "users",
              through: { model: UserGroup },
              where: { id: userId },
            },
          }
        : {
            where: { id: group.id, ownerId: userId },
          };
    const existingGroup = await Group.findOne(query);
    if (existingGroup) {
      const newJsData = JSON.stringify({
        id: group.id,
        namn: group.namn,
        personer: group.personer,
      });
      await existingGroup.update({
        name: group.namn,
        jsData: newJsData,
        ownerId: userId,
      });
      return existingGroup;
    }
  }
  const newGroup = await Group.create({
    name: group.namn,
    jsData: JSON.stringify({
      id: group.id,
      namn: group.namn,
      personer: group.personer,
    }),
    ownerId: userId,
  });
  return { ...newGroup.dataValues, id: newGroup.id };
}

/**
 * Upserts a room for a user.
 *
 * @param {number} userId - The ID of the user.
 * @param {Object} room - The room object to upsert.
 * @param {number|string} room.id - The ID of the room.
 * @param {string} room.namn - The name of the room.
 * @param {number} room.rows - The number of rows in the room.
 * @param {number} room.cols - The number of columns in the room.
 * @param {Array} room.grid - The grid layout of the room.
 * @returns {Promise<Object>} The upserted room object.
 * @throws {Error} If the room is not found.
 */
async function upsertRoom(userId, room) {
  const roomHasOldIdFormat = checkIfSpecial(room.id);

  const newJsData = JSON.stringify({
    id: room.id,
    namn: room.namn,
    rows: room.rows,
    cols: room.cols,
    grid: room.grid,
  });

  const data = {
    name: room.namn,
    jsData: newJsData,
  };

  if (!roomHasOldIdFormat) {
    const query =
      room.owner !== "you"
        ? {
            where: { id: room.id },
            include: {
              model: User,
              as: "users",
              through: { model: UserRoom },
              where: { id: userId },
            },
          }
        : { where: { id: room.id, ownerId: userId } };
    const existingRoom = await Room.findOne(query);

    if (existingRoom) {
      try {
        await existingRoom.update({ ...data, ownerId: userId });
        return existingRoom;
      } catch (error) {
        console.error("Error updating room:", error);
        return null;
      }
    }
  }

  const newRoom = await Room.create({ ...data, ownerId: userId });
  return { ...newRoom.dataValues, id: newRoom.id };
}

function findGroupIdForSeatingPlan(groups, seatingPlan) {
  groups.find((group) => JSON.parse(group.jsData).id === seatingPlan.klass?.id)
    ?.id ||
    groups.find(
      (group) => JSON.parse(group.jsData).namn === seatingPlan.klass?.namn
    )?.id ||
    null;
}

/**
 *
 * @param {Array} rooms - An array of the room objects.
 * @param {Object} seatingPlan - A seating plan object.
 * @returns {Integer} - The id to map as seating plan klassid.
 */
function findRoomIdForSeatingPlan(rooms, seatingPlan) {
  rooms.find((room) => JSON.parse(room.jsData).id === seatingPlan.klassrum.id)
    ?.id ||
    rooms.find(
      (room) => JSON.parse(room.jsData).namn === seatingPlan.klassrum.namn
    )?.id ||
    null;
}

/**
 * Upserts a seating plan for a user.
 *
 * @param {number} userId - The ID of the user.
 * @param {Object} seatingPlan - The seating plan object to upsert.
 * @param {number|string} seatingPlan.id - The ID of the seating plan.
 * @param {string} seatingPlan.namn - The name of the seating plan.
 * @param {Object} seatingPlan.klass - The class associated with the seating plan.
 * @param {Object} seatingPlan.klassrum - The room associated with the seating plan.
 * @param {Array} groups - The list of groups.
 * @param {Array} rooms - The list of rooms.
 * @returns {Promise<Object>} The upserted seating plan object.
 */
async function upsertSeatingPlan(userId, seatingPlan, groups, rooms) {
  const isSpecialId = checkIfSpecial(seatingPlan.id);

  const groupId = findGroupIdForSeatingPlan(groups, seatingPlan);
  const roomId = findRoomIdForSeatingPlan(rooms, seatingPlan);

  const seatingPlanData = {
    klass: {
      id: groupId,
      namn: seatingPlan.klass?.namn || "",
      personer: seatingPlan.klass?.personer || [],
    },
    klassrum: {
      id: roomId,
      namn: seatingPlan.klassrum.namn,
      rows: seatingPlan.klassrum.rows,
      cols: seatingPlan.klassrum.cols,
      grid: seatingPlan.klassrum.grid,
    },
  };

  if (!isSpecialId) {
    const query =
      seatingPlan.owner !== "you"
        ? {
            where: { id: seatingPlan.id },
            include: {
              model: User,
              as: "users",
              through: { model: UserSeatingPlan },
              where: { id: userId },
            },
          }
        : {
            where: { id: seatingPlan.id, ownerId: userId },
          };
    const existingPlan = await SeatingPlan.findOne(query);
    if (existingPlan) {
      await existingPlan.update({
        name: seatingPlan.namn,
        jsData: JSON.stringify(seatingPlanData),
      });
      return existingPlan;
    }
  }
  const newPlan = await SeatingPlan.create({
    name: seatingPlan.namn,
    jsData: JSON.stringify(seatingPlanData),
    ownerId: userId,
  });
  return newPlan;
}

/**
 * Updates user entities including groups, rooms, and seating plans using the old "jsData"-format.
 *
 * @param {string} userId - The ID of the user whose entities are being updated.
 * @param {Object} jsData - The jsData object from the old backend "jsData" column.
 * @param {Array} jsData.klasser - An array of group objects to be upserted.
 * @param {Array} jsData.klassrum - An array of room objects to be upserted.
 * @param {Array} jsData.placeringar - An array of seating plan objects to be upserted.
 * @returns {Promise<Object>} - A promise that resolves to the updated user data.
 */
async function updateUserEntities(userId, jsData) {
  if (!userId) {
    throw new Error("userId is required");
  }
  if (!jsData) {
    throw new Error("jsData is required");
  }
  const groupsPromise = Promise.all(
    jsData.klasser.map((group) => upsertGroup(userId, group))
  );
  const roomsPromise = Promise.all(
    jsData.klassrum.map((room) => upsertRoom(userId, room))
  );

  const [groups, rooms] = await Promise.all([groupsPromise, roomsPromise]);
  const seatingPlans = await Promise.all(
    jsData.placeringar.map((plan) =>
      upsertSeatingPlan(userId, plan, groups, rooms)
    )
  );

  await Promise.all(seatingPlans.map((plan) => mapNewIds(plan, "seatingPlan")));
  await Promise.all(groups.map((group) => mapNewIds(group, "group")));
  await Promise.all(rooms.map((room) => mapNewIds(room, "room")));

  const newUserData = await getNiceUserData(userId);
  return newUserData.oldFrontendData;
}

module.exports = updateUserEntities;
