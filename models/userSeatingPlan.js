"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserSeatingPlan extends Model {
    static associate(models) {
      UserSeatingPlan.belongsTo(models.User, { foreignKey: "user_id" });
      UserSeatingPlan.belongsTo(models.SeatingPlan, {
        foreignKey: "seating_plan_id",
      });
    }
  }

  UserSeatingPlan.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seating_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permissions: {
        type: DataTypes.ENUM({
          values: ["read", "edit", "owner"],
        }),
        allowNull: false,
        defaultValue: "edit",
      },
    },
    {
      sequelize,
      modelName: "UserSeatingPlan",
      tableName: "users_seating_plans",
      timestamps: false,
    }
  );

  return UserSeatingPlan;
};
