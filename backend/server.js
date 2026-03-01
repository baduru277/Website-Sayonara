const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Import sequelize and models
const sequelize = require('./config/database');
const { User, Item, Bid, Subscription } = require('./models');

// -------------------- Middlewares --------------------
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ✅ Serve uploaded images (product images, payment proofs etc.)
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ Created uploads directory');
}
app.use('/uploads', express.static(uploadsPath));

// -------------------- Load Routes --------------------
console.log('🔧 Loading routes...');

const indexRouter   = require('./routes/index');
const authRouter    = require('./routes/auth');
const itemsRouter   = require('./routes/items');
const usersRouter   = require('./routes/users');
const adminRouter   = require('./routes/admin');
const uploadRouter  = require('./routes/upload');
const messagesRouter = require('./routes/messages');

console.log('✓ Routes imported successfully');

// -------------------- Register Routes --------------------
app.use('/api',          indexRouter);
console.log('✓ GET /api registered');
app.use('/api/messages', messagesRouter);
console.log('✓ GET /api messagesRouter');



app.use('/api/auth',     authRouter);
console.log('✓ /api/auth/* routes registered');

app.use('/api/items',    itemsRouter);
console.log('✓ /api/items/* routes registered');

app.use('/api/users',    usersRouter);
console.log('✓ /api/users/* routes registered');

app.use('/api/admin',    adminRouter);
console.log('✓ /api/admin/* routes registered');

app.use('/api/upload',   uploadRouter);
console.log('✓ /api/upload/* routes registered');


// -------------------- Health Check --------------------
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected',
    version: '1.0.0'
  });
});
console.log('✓ GET /health registered');

// -------------------- Multer Error Handler --------------------
// Must be before general error handler
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ error: 'Too many files. Maximum 10 files allowed.' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected file field.' });
  }
  next(err);
});

// -------------------- 404 Handler --------------------
app.use((req, res) => {
  console.warn(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// -------------------- Global Error Handler --------------------
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Server error'
  });
});

// -------------------- Start Server --------------------
const startServer = async () => {
  try {
    console.log('🔄 Connecting to database...');

    // ✅ FIXED: NEVER delete database - removed the dangerous delete code
    // Only sync without force to preserve existing data
    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized');

    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Backend running on port ${port}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📍 Accessible at: http://0.0.0.0:${port}`);
      console.log('');
      console.log('Available endpoints:');
      console.log('  GET    /health');
      console.log('  GET    /api');
      console.log('  POST   /api/auth/register');
      console.log('  POST   /api/auth/login');
      console.log('  GET    /api/auth/me');
      console.log('  GET    /api/items');
      console.log('  GET    /api/items/:id');
      console.log('  POST   /api/items');
      console.log('  PUT    /api/items/:id');
      console.log('  DELETE /api/items/:id');
      console.log('  GET    /api/users/dashboard');
      console.log('  PUT    /api/users/profile');
      console.log('  GET    /api/users/subscription');
      console.log('  GET    /api/admin/dashboard/stats');
      console.log('  GET    /api/admin/subscriptions/pending');
      console.log('  POST   /api/admin/subscriptions/:id/approve');
      console.log('  POST   /api/admin/subscriptions/:id/reject');
      console.log('  GET    /api/admin/users');
      console.log('  POST   /api/upload/single');
      console.log('  POST   /api/upload/multiple');
      console.log('  DELETE /api/upload/delete/:filename');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
