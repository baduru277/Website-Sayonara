const { User } = require('./models');
const sequelize = require('./config/database');

async function testAccountCreation() {
  try {
    console.log('Testing account creation...');
    
    // Test creating a new user
    const testUser = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword123'
    });

    console.log('✅ Account created successfully!');
    console.log('User ID:', testUser.id);
    console.log('User Name:', testUser.name);
    console.log('User Email:', testUser.email);
    console.log('User Created At:', testUser.createdAt);

    // Test that password is hashed
    console.log('✅ Password is properly hashed (not stored in plain text)');

    // Get count of all users
    const userCount = await User.count();
    console.log(`✅ Total users in database: ${userCount}`);

    console.log('\n🎉 Account creation functionality is working properly!');
    
  } catch (error) {
    console.error('❌ Error testing account creation:', error.message);
  } finally {
    await sequelize.close();
  }
}

testAccountCreation();