const sequelize = require('./config/database');
const { User, Item, Bid } = require('./models');

async function setupDatabase() {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection successful!');

    console.log('Creating database tables...');
    await sequelize.sync({ force: false, alter: true });
    console.log('Database tables created successfully!');

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();