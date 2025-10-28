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

// IMPORTANT: Increase request size limit to handle images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

console.log('🔧 Loading routes...');

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');

console.log('✓ Routes imported successfully');

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
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');

    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Backend running on port ${port}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('Available endpoints:');
      console.log('  GET  /health');
      console.log('  GET  /api/items');
      console.log('  POST /api/items');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
