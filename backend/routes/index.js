// routes/index.js
const express = require('express');
const router = express.Router();

/* API root */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Sayonara API root',
    timestamp: new Date().toISOString()
  });
});

/* Health check endpoint */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Sayonara API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
