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

// ✅ Serve uploaded images
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ Created uploads directory');
}
app.use('/uploads', express.static(uploadsPath));

// -------------------- Load Routes --------------------
console.log('🔧 Loading routes...');

const indexRouter        = require('./routes/index');
const authRouter         = require('./routes/auth');
const itemsRouter        = require('./routes/items');
const usersRouter        = require('./routes/users');
const adminRouter        = require('./routes/admin');
const uploadRouter       = require('./routes/upload');
const messagesRouter     = require('./routes/messages');
const { router: notificationsRouter } = require('./routes/notifications');
const referralRouter     = require('./routes/referral');        // ✅ NEW
const aadhaarRouter      = require('./routes/aadhaar');         // ✅ NEW

console.log('✓ Routes imported successfully');

// -------------------- Notification Model --------------------
const NotificationModel  = require('./models/Notification');
const ReferralModel      = require('./models/Referral');        // ✅ NEW

const Notification = NotificationModel(sequelize);
const Referral     = ReferralModel(sequelize);                  // ✅ NEW

// Associations
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Referral, { foreignKey: 'referrerId', as: 'referrals' }); // ✅ NEW

// -------------------- Register Routes --------------------
app.use('/api',                indexRouter);
console.log('✓ GET /api registered');

app.use('/api/messages',       messagesRouter);
console.log('✓ /api/messages/* routes registered');

app.use('/api/auth',           authRouter);
console.log('✓ /api/auth/* routes registered');

app.use('/api/items',          itemsRouter);
console.log('✓ /api/items/* routes registered');

app.use('/api/users',          usersRouter);
console.log('✓ /api/users/* routes registered');

app.use('/api/admin',          adminRouter);
console.log('✓ /api/admin/* routes registered');

app.use('/api/upload',         uploadRouter);
console.log('✓ /api/upload/* routes registered');

app.use('/api/notifications',  notificationsRouter);
console.log('✓ /api/notifications/* routes registered');

// app.use('/api/referral',       referralRouter);                 // ✅ NEW
// console.log('✓ /api/referral/* routes registered');

// app.use('/api/aadhaar',        aadhaarRouter);                  // ✅ NEW
// console.log('✓ /api/aadhaar/* routes registered');

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

// -------------------- Multer Error Handler --------------------
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
  if (err.code === 'LIMIT_FILE_COUNT') return res.status(400).json({ error: 'Too many files. Maximum 10 files allowed.' });
  if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ error: 'Unexpected file field.' });
  next(err);
});

// -------------------- 404 Handler --------------------
app.use((req, res) => {
  console.warn(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found', path: req.path, method: req.method });
});

// -------------------- Global Error Handler --------------------
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// -------------------- Start Server --------------------
const startServer = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.sync({ alter: true });   // ✅ alter:true picks up new columns
    console.log('✅ Database synchronized');

    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Backend running on port ${port}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('');
      console.log('Available endpoints:');
      console.log('  GET    /health');
      console.log('  POST   /api/auth/register');
      console.log('  POST   /api/auth/login');
      console.log('  GET    /api/items');
      console.log('  GET    /api/users/dashboard');
      console.log('  GET    /api/notifications');
      console.log('  PUT    /api/notifications/mark-all-read');
      console.log('  GET    /api/referral/my');              // ✅ NEW
      console.log('  POST   /api/referral/apply');           // ✅ NEW
      // console.log('  POST   /api/aadhaar/send-otp');         // ✅ NEW
      // console.log('  POST   /api/aadhaar/verify-otp');       // ✅ NEW
    });

  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
