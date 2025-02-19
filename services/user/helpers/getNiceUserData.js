const {
  Organization,
  User,
  Membership,
  Room,
  SeatingPlan,
  Group,
  UserRoom,
  UserSeatingPlan,
  UserGroup,
} = require("../../../models");

async function getNiceUserData(userId) {
  const organizations = await Organization.findAll({
    include: {
      model: User,
      as: "members",
      through: { model: Membership },
      where: { id: userId },
    },
  });

  const [ownedRooms, sharedRooms] = await Promise.all([
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

  const [ownedSeatingPlans, sharedSeatingPlans] = await Promise.all([
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

  const [ownedGroups, sharedGroups] = await Promise.all([
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

  const formatEntityData = (owned, shared) => {
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
  };

  const formatOrganizationData = (orgs) => {
    return orgs.map((org) => {
      const isOwner = org.owner_id === userId;
      return {
        id: org.id,
        name: org.name,
        role: isOwner ? "owner" : "member",
      };
    });
  };

  const roomsData = formatEntityData(ownedRooms, sharedRooms);
  const seatingPlansData = formatEntityData(
    ownedSeatingPlans,
    sharedSeatingPlans
  );
  const groupsData = formatEntityData(ownedGroups, sharedGroups);
  const organizationData = formatOrganizationData(organizations);

  const removeDuplicates = (arr) =>
    arr.filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    );

  const oldFrontendData = {
    klasser: removeDuplicates(
      groupsData.map((group) => {
        const jsData = JSON.parse(group.jsData);
        return {
          id: group.id,
          namn: group.name,
          permissions: group.permissions,
          personer: jsData.personer,
          owner: group.ownerId === userId ? "you" : group.ownerId,
        };
      })
    ),
    klassrum: removeDuplicates(
      roomsData.map((room) => {
        const jsData = JSON.parse(room.jsData);
        return {
          id: room.id,
          permissions: room.permissions,
          owner: room.ownerId === userId ? "you" : room.ownerId,
          namn: room.name,
          rows: jsData.rows,
          cols: jsData.cols,
          grid: jsData.grid,
        };
      })
    ),
    placeringar: removeDuplicates(
      seatingPlansData.map((seatingPlan) => {
        const jsData = JSON.parse(seatingPlan.jsData);
        return {
          id: seatingPlan.id,
          permissions: seatingPlan.permissions,
          owner: seatingPlan.ownerId === userId ? "you" : seatingPlan.ownerId,
          namn: seatingPlan.name,
          klassrum: { ...jsData.klassrum },
          klass: { ...jsData.klasser },
        };
      })
    ),
  };

  return {
    oldFrontendData,
  };
}
module.exports = getNiceUserData;
