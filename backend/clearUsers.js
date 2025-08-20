const sequelize = require('./config/database');

async function clearAllUsers() {
  try {
    console.log('Clearing all user data...');
    
    if (sequelize.inMemoryDB) {
      // Clear in-memory database
      sequelize.inMemoryDB.users.clear();
      sequelize.inMemoryDB.nextUserId = 1;
      console.log('✅ All users cleared from in-memory database');
      console.log(`📊 Users remaining: ${sequelize.inMemoryDB.users.size}`);
    } else {
      // Clear real database
      const { User } = require('./models');
      const deletedCount = await User.destroy({
        where: {},
        truncate: true
      });
      console.log(`✅ Deleted ${deletedCount} users from database`);
    }
    
    console.log('🎉 All user data has been cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing users:', error);
  } finally {
    process.exit(0);
  }
}

clearAllUsers(); 