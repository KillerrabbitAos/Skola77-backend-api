const {
  User,
  Room,
  SeatingPlan,
  Group,
  UserRoom,
  UserSeatingPlan,
  UserGroup,
} = require("../../../models");

function ownedAndSharedRoomsOfUserById(userId) {
  return Promise.all([
    Room.findAll({ where: { ownerId: userId } }),
    Room.findAll({
      include: {
        model: User,
        as: "users",
        through: { model: UserRoom },
        where: { id: userId },
      },
    }),
  ]);
}

function ownedAndSharedSeatingPlansOfUserById(userId) {
  return Promise.all([
    SeatingPlan.findAll({ where: { ownerId: userId } }),
    SeatingPlan.findAll({
      include: {
        model: User,
        as: "users",
        through: { model: UserSeatingPlan },
        where: { id: userId },
      },
    }),
  ]);
}

function ownedAndSharedGroupsOfUserById(userId) {
  return Promise.all([
    Group.findAll({ where: { ownerId: userId } }),
    Group.findAll({
      include: {
        model: User,
        as: "users",
        through: { model: UserGroup },
        where: { id: userId },
      },
    }),
  ]);
}

function formatEntityData(owned, shared) {
  return [
    ...owned.map((entity) => ({
      ...entity.toJSON(),
      source: `owned by user ${entity.ownerId}`,
      permissions: "owner",
    })),
    ...shared.map((entity) => ({
      ...entity.toJSON(),
      source: `shared by user ${entity.ownerId}`,
      permissions: "read",
    })),
  ];
}
const removeDuplicates = (arr) =>
  arr.filter(
    (value, index, self) => index === self.findIndex((t) => t.id === value.id)
  );

function convertGroupToOldFrontendFormat(group, userId) {
  const jsData = JSON.parse(group.jsData);
  return {
    id: group.id,
    namn: group.name,
    permissions: group.permissions,
    personer: jsData.personer,
    owner: group.ownerId === userId ? "you" : group.ownerId,
  };
}

function convertRoomToOldFrontendFormat(room, userId) {
  const jsData = JSON.parse(room.jsData);
  return {
    id: room.id,
    namn: room.name,
    permissions: room.permissions,
    owner: room.ownerId === userId ? "you" : room.ownerId,
    rows: jsData.rows,
    cols: jsData.cols,
    grid: jsData.grid,
  };
}

function convertSeatingPlanToOldFrontendFormat(seatingPlan, userId) {
  const jsData = JSON.parse(seatingPlan.jsData);
  return {
    id: seatingPlan.id,
    permissions: seatingPlan.permissions,
    owner: seatingPlan.ownerId === userId ? "you" : seatingPlan.ownerId,
    namn: seatingPlan.name,
    klassrum: { ...jsData.klassrum },
    klass: { ...jsData.klass },
  };
}

async function getNiceUserData(userId) {
  const [ownedRooms, sharedRooms] = await ownedAndSharedRoomsOfUserById(userId);

  const [ownedSeatingPlans, sharedSeatingPlans] =
    await ownedAndSharedSeatingPlansOfUserById(userId);

  const [ownedGroups, sharedGroups] =
    await ownedAndSharedGroupsOfUserById(userId);

  const roomsData = formatEntityData(ownedRooms, sharedRooms);
  const seatingPlansData = formatEntityData(
    ownedSeatingPlans,
    sharedSeatingPlans
  );
  const groupsData = formatEntityData(ownedGroups, sharedGroups);

  const oldFrontendData = {
    klasser: removeDuplicates(
      groupsData.map((group) => convertGroupToOldFrontendFormat(group, userId))
    ),
    klassrum: removeDuplicates(
      roomsData.map((room) => convertRoomToOldFrontendFormat(room, userId))
    ),
    placeringar: removeDuplicates(
      seatingPlansData.map((seatingPlan) =>
        convertSeatingPlanToOldFrontendFormat(seatingPlan, userId)
      )
    ),
  };

  return {
    oldFrontendData,
  };
}
module.exports = getNiceUserData;
