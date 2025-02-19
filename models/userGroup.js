"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserGroup extends Model {
    static associate(models) {
      // Lägg till "through" alternativet med join-modellen UserGroup
      UserGroup.belongsTo(models.User)
      UserGroup.belongsTo(models.Group)
    }
  }

  UserGroup.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      group_id: {
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
      modelName: "UserGroup",
      tableName: "users_groups",
      timestamps: false,
    }
  );

  return UserGroup;
};
