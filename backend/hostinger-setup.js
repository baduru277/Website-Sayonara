#!/usr/bin/env node

/**
 * Hostinger Setup Script
 * Run this script after deploying to Hostinger to set up the database
 */

const { User, Item, Bid } = require('./models');
const sequelize = require('./config/database');

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    console.log('🔄 Creating database tables...');
    
    // Sync all models (create tables)
    await sequelize.sync({ force: false }); // Set to true to drop and recreate tables
    console.log('✅ Database tables created successfully');

    console.log('🔄 Creating default admin user...');
    
    // Create a default admin user if it doesn't exist
    const [adminUser, created] = await User.findOrCreate({
      where: { email: 'admin@sayonara.com' },
      defaults: {
        name: 'Admin',
        email: 'admin@sayonara.com',
        password: 'admin123', // This will be hashed automatically
        isVerified: true,
        isPrime: true
      }
    });

    if (created) {
      console.log('✅ Default admin user created');
      console.log('📧 Email: admin@sayonara.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️  Please change the password after first login!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Run the setup
setupDatabase();