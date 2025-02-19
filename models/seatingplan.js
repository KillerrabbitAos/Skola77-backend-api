"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SeatingPlan extends Model {
    static associate(models) {
      SeatingPlan.belongsTo(models.User, { foreignKey: "owner_id" });
      SeatingPlan.belongsToMany(models.User, {
        through: models.UserSeatingPlan,
        foreignKey: "seating_plan_id",
        as: "users",
      });
      SeatingPlan.belongsToMany(models.Organization, {
        through: models.OrganizationSeatingPlan,
        foreignKey: models.OrganizationSeatingPlan.seatingPlanId,
        as: "organizations",
      });

    }
  }

  SeatingPlan.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      jsData: {
        type: DataTypes.TEXT("long"),
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SeatingPlan",
      tableName: "seating_plans",
      timestamps: true,
    }
  );

  return SeatingPlan;
};
