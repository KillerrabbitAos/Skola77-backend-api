"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.belongsTo(models.User, { foreignKey: "owner_id" });
      Room.belongsToMany(models.User, {
        through: models.UserRoom,
        foreignKey: "room_id",
        as: "users",
      });
      Room.belongsToMany(models.Organization, {
        through: models.OrganizationGroup,
        foreignKey: "room_id",
        as: "organizations",
      });
    }
  }

  Room.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jsData: {
        type: DataTypes.TEXT
      }
    },
    {
      sequelize,
      modelName: "Room",
      tableName: "rooms",
      timestamps: true,
    }
  );

  return Room;
};
