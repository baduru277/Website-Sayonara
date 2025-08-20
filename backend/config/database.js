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
  // Development - use simple in-memory storage
  console.log('Using in-memory storage for development');
  
  // Create a simple in-memory database simulation
  const inMemoryDB = {
    users: new Map(),
    items: new Map(),
    bids: new Map(),
    nextUserId: 1,
    nextItemId: 1,
    nextBidId: 1
  };

  // Mock Sequelize instance
  sequelize = {
    authenticate: () => Promise.resolve(),
    sync: () => Promise.resolve(),
    models: {},
    transaction: () => Promise.resolve(),
    close: () => Promise.resolve(),
    // Add our in-memory database
    inMemoryDB
  };
}

module.exports = sequelize; 