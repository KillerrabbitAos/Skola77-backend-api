"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate(models) {
      Organization.belongsTo(models.User, { foreignKey: "creator_id" }); 
      Organization.belongsToMany(models.User, {
        as: "members",
        through: models.Membership,
        foreignKey: "organization_id",
      });
      Organization.belongsToMany(models.SeatingPlan, {
        through: models.OrganizationSeatingPlan,
        foreignKey: "organization_id",
      });
      Organization.belongsToMany(models.Room, {
        through: models.OrganizationRoom,
        foreignKey: "organization_id",
      });
      Organization.belongsToMany(models.Group, {
        through: models.OrganizationGroup,
        foreignKey: "organization_id",
      });
    }
  }

  Organization.init(
    {
      name: DataTypes.STRING,
      owner_id: DataTypes.INTEGER,
      creator_id: DataTypes.INTEGER, 
    },
    {
      sequelize,
      modelName: "Organization",
      tableName: "organizations",
      timestamps: false,
    }
  );

  return Organization;
};
