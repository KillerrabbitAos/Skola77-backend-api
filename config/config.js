require('dotenv').config();

module.exports = {
  development: {
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "postgres",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    dialect: process.env.DB_DIALECT || "postgres",
    logging: process.env.LOGGING || false
  },
  test: {
    host: process.env.DB_HOST || "127.0.0.1",
    database: process.env.DB_NAME || "database_test",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    dialect: process.env.DB_DIALECT || "postgres",
    logging: process.env.LOGGING || false
  },
  production: {
    host: process.env.DB_HOST || "127.0.0.1",
    database: process.env.DB_NAME || "database_production",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || null,
    dialect: process.env.DB_DIALECT || "postgres",
  },
};
