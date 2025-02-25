"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = "test";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config?.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    define: {
      underscored: true, // Convert camelCase to snake_case
    },
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    define: {
      underscored: true, // Convert camelCase to snake_case
    },
  });
}

// Dynamically load all models
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file.slice(-3) === ".js" &&
      file !== basename &&
      file.indexOf(".test.js") === -1 &&
      file !== "index.js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Automatically call the associate function if defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .sync({ force: true })
  .catch((err) => console.error("Error syncing database:", err));

module.exports = db;
