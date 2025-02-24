"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, { foreignKey: "owner_id" });
      Group.belongsToMany(models.User, {
        through: models.UserGroup,
        foreignKey: "group_id",
        as: "users",
      });
      Group.belongsToMany(models.Organization, {
        through: models.OrganizationGroup,
        foreignKey: "group_id",
        as: "organizations", 
      });
    }
  }

  Group.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      jsData: {
        type: DataTypes.TEXT,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Group",
      tableName: "groups",
      timestamps: true,
    }
  );

  return Group;
};
