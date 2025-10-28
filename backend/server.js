const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Import sequelize and models
const sequelize = require('./config/database');
const { User, Item, Bid } = require('./models');

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('🔧 Loading routes...');

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');

console.log('✓ Routes imported successfully');

// API routes with prefix
app.use('/api', indexRouter);
console.log('✓ GET /api registered');

app.use('/api/auth', authRouter);
console.log('✓ POST /api/auth/register registered');
console.log('✓ POST /api/auth/login registered');

app.use('/api/items', itemsRouter);
console.log('✓ /api/items/* routes registered');

app.use('/api/users', usersRouter);
console.log('✓ /api/users/* routes registered');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});
console.log('✓ GET /health registered');

// 404 handler
app.use((req, res) => {
  console.warn(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found', path: req.path, method: req.method });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: err.message || 'Server error' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🔄 Connecting to database...');

    // Delete old database file for fresh start (development only)
    if (process.env.NODE_ENV !== 'production') {
      const dbPath = path.join(__dirname, 'database.sqlite');
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log('🗑️  Cleaned up old database');
      }
    }

    // Sync database
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');

    // Start server
    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Backend running on port ${port}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📍 Accessible at: http://0.0.0.0:${port}`);
      console.log('');
      console.log('Available endpoints:');
      console.log(`  GET  /health`);
      console.log(`  GET  /api`);
      console.log(`  POST /api/auth/register`);
      console.log(`  POST /api/auth/login`);
      console.log(`  GET  /api/items`);
      console.log(`  GET  /api/items/:id`);
      console.log(`  POST /api/items`);
      console.log(`  GET  /api/users/profile`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
