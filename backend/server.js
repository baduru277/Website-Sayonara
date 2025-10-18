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
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');

// API routes with prefix
app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/users', usersRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
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
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
