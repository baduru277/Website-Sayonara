// const { Sequelize } = require('sequelize');
// require('dotenv').config();
// const path = require('path');

// let sequelize;

// if (process.env.DATABASE_URL) {
//   // Production / cloud DB
//   console.log('🔗 Connecting to production database...');
//   sequelize = new Sequelize(process.env.DATABASE_URL, {
//     dialect: 'postgres',
//     protocol: 'postgres',
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//     logging: false,
//   });
// } else {
//   // Development - use SQLite locally
//   console.log('📁 Using SQLite for development');
//   sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: path.join(__dirname, '../database.sqlite'),
//     logging: false,
//   });
// }

// // Test connection
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('✅ Database connection established');
//   })
//   .catch(error => {
//     console.error('❌ Database connection error:', error);
//   });

// module.exports = sequelize;
