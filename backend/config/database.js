const { Sequelize } = require('sequelize');
require('dotenv').config();
const path = require('path');

let sequelize;

if (process.env.DATABASE_URL) {
  // Production / cloud DB
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
} else {
  // Development - use SQLite locally
  console.log('Using SQLite for development');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'), // file will be created automatically
    logging: false,
  });
}

module.exports = sequelize;
