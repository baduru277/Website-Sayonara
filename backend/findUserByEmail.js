const sequelize = require('./config/database');
const { User } = require('./models');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node findUserByEmail.js user@example.com');
  process.exit(1);
}

(async () => {
  try {
    await sequelize.authenticate();
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (user) {
      console.log(`User found:`, user.toJSON());
    } else {
      console.log('No user found with that email.');
    }
  } catch (err) {
    console.error('Error querying user:', err);
  } finally {
    await sequelize.close();
    process.exit();
  }
})(); 