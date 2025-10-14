const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');

// Unified API prefix so frontend can call `${BASE_URL}/api/*`
app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/users', usersRouter);

// Top-level health endpoint for platform probes
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Start server after ensuring database is ready
(async () => {
  try {
    // Ensure DB connection and create/update tables
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');

    app.listen(port, () => {
      console.log(`✅ Backend running on port ${port}`);
    });
  } catch (err) {
    console.error('❌ Failed to initialize database or start server:', err);
    process.exit(1);
  }
})();
