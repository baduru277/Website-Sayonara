const sequelize = require('./config/database');
const { User, Item, Bid } = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    // Truncate all tables (order matters due to foreign keys)
    await Bid.destroy({ where: {}, truncate: true, force: true });
    await Item.destroy({ where: {}, truncate: true, force: true });
    await User.destroy({ where: {}, truncate: true, force: true });
    console.log('All tables truncated. Database is now empty.');
  } catch (err) {
    console.error('Error clearing database:', err);
  } finally {
    await sequelize.close();
    process.exit();
  }
})(); 