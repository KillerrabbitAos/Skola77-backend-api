const {
  User,
  Group,
  SeatingPlan,
  Room,
  Organization,
  Membership,
} = require("../../models");
const Sequelize = require("sequelize");

async function users(query, userId) {
  const userMemberInclude = {
    model: User,
    as: "members",
    through: { attributes: [] },
    where: { id: userId },
    required: true,
  };

  const organizationInclude = {
    model: Organization,
    as: "members",
    through: { attributes: [] },
    required: true,
    include: [userMemberInclude],
  };

  const orgMemberWhere = {
    [Sequelize.Op.or]: [
      { name: { [Sequelize.Op.iLike]: `${query}%` } },
      { email: { [Sequelize.Op.iLike]: `${query}%` } },
    ],
  };

  const organizationMembers = await User.findAll({
    include: [organizationInclude],
    where: orgMemberWhere,
    attributes: ["id", "name", "email"],
  });

  const exactMatchCondition = {
    [Sequelize.Op.or]: [
      { name: { [Sequelize.Op.eq]: query } },
      { email: { [Sequelize.Op.eq]: query } },
    ],
  };

  const notInOrganizationCondition = {
    id: {
      [Sequelize.Op.notIn]: organizationMembers.map((member) => member.id),
    },
  };

  const outsiders = await User.findAll({
    where: {
      [Sequelize.Op.and]: [exactMatchCondition, notInOrganizationCondition],
    },
    attributes: ["id", "name", "email"],
  });

  const result = [...organizationMembers, ...outsiders].map((member) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    avatar: `http://localhost:5051/uploads/${member.id}/pfp.png`,
  }));

  return result;
}
module.exports = {
  users,
};
