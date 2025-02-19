"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrganizationSeatingPlan extends Model {
    static associate(models) {
      OrganizationSeatingPlan.belongsTo(models.Organization)
      OrganizationSeatingPlan.belongsTo(models.User)
    }
  }

  OrganizationSeatingPlan.init(
    {
      organization_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      seating_plan_id: {
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
      modelName: "OrganizationSeatingPlan",
      tableName: "organizations_seating_plans",
      timestamps: false
    }
  );

  return OrganizationSeatingPlan;
};
