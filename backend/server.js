const express = require('express');
const cors = require('cors');
require('dotenv').config();

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

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/items', itemsRouter);
app.use('/users', usersRouter);

// Start server
app.listen(port, () => {
  console.log(`✅ Backend running on port ${port}`);
});
