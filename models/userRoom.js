"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserRoom extends Model {
    static associate(models) {
      UserRoom.belongsTo(models.User, { foreignKey: "user_id" });
      UserRoom.belongsTo(models.Room, { foreignKey: "room_id" });
    }
  }

  UserRoom.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      room_id: {
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
      modelName: "UserRoom",
      tableName: "users_rooms",
      timestamps: false,
    }
  );

  return UserRoom;
};
