"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrganizationGroup extends Model {
    static associate(models) {
      OrganizationGroup.belongsTo(models.Organization)
      OrganizationGroup.belongsTo(models.User)
    }
  }

  OrganizationGroup.init(
    {
      organization_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      permissions: {
        type: DataTypes.ENUM("read", "edit"),
        defaultValue: "read"
      }
    },
    {
      sequelize,
      modelName: "OrganizationGroup",
      tableName: "organizations_groups",
      timestamps: false
    }
  );

  return OrganizationGroup;
};
