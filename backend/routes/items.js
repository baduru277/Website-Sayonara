// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Import routes
const indexRouter = require('./routes');
const itemsRouter = require('./routes/items');
const authRouter = require('./routes/auth'); // <-- add this if you have login/signup
const userRouter = require('./routes/user'); // optional

// ✅ Use routes
app.use('/api', indexRouter);        // base /api (health, etc.)
app.use('/api/items', itemsRouter);  // items routes
app.use('/api/auth', authRouter);    // login/signup routes
app.use('/api/user', userRouter);    // user routes (if exists)

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
