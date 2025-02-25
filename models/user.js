"use strict";
const { Model, Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Room, { foreignKey: "owner_id", as: "owned_rooms" });
      User.hasMany(models.Group, {
        foreignKey: "owner_id",
        as: "owned_groups",
      });
      User.hasMany(models.SeatingPlan, {
        as: "owned_seating_plans",
        foreignKey: "owner_id",
      });
      User.belongsToMany(models.Organization, {
        through: models.Membership,
        foreignKey: "user_id",
        as: "members",
      });
      User.belongsToMany(models.Group, {
        through: models.UserGroup,
        foreignKey: "user_id",
        as: "received_groups",
      });
      User.belongsToMany(models.Room, {
        through: models.UserRoom,
        foreignKey: "user_id",
        as: "received_rooms",
      });
      User.belongsToMany(models.SeatingPlan, {
        through: models.UserSeatingPlan,
        foreignKey: "user_id",
        as: "received_seating_plans",
      });
      User.hasMany(models.Organization, {
        as: "owner",
        foreignKey: "owner_id",
      });
      User.belongsToMany(models.Room, {
        through: models.UserRoom,
        foreignKey: "user_id",
        as: "rooms",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, unique: true },
      email: { type: DataTypes.STRING, unique: true },
      password: { type: DataTypes.STRING, unique: true },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      lastLogin: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING,
        defaultValue: "en",
      },
      lastnameFirst: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      banned_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ban_duration_in_seconds: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      banned_forever: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};
