const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Production/Cloud database (Render, Heroku, etc.)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  // For development without database setup - mock Sequelize
  console.log('Warning: Running without database connection for development');
  sequelize = {
    authenticate: () => Promise.resolve(),
    define: () => ({}),
    sync: () => Promise.resolve(),
    models: {},
    transaction: () => Promise.resolve(),
    close: () => Promise.resolve()
  };
}

module.exports = sequelize; 