"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrganizationRoom extends Model {
    static associate(models) {
      OrganizationRoom.belongsTo(models.Organization)
      OrganizationRoom.belongsTo(models.User)
    }
  }

  OrganizationRoom.init(
    {
      organization_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      room_id: {
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
      modelName: "OrganizationRoom",
      tableName: "organizations_rooms",
      timestamps: false
    }
  );

  return OrganizationRoom;
};
