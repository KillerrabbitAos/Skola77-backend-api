"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    static associate(models) {
      Membership.belongsTo(models.User, { foreignKey: "user_id" });
      Membership.belongsTo(models.Organization, {
        foreignKey: "organization_id",
      });
    }
  }

  Membership.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      organization_id: {
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
      modelName: "Membership",
      tableName: "memberships",
      timestamps: false,
    }
  );

  return Membership;
};
