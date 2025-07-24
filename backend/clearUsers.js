const sequelize = require('./config/database');

(async () => {
  try {
    await sequelize.query('TRUNCATE "Bids", "Items", "Users" RESTART IDENTITY CASCADE;');
    console.log('All users, items, and bids cleared.');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing tables:', err);
    process.exit(1);
  }
})(); 