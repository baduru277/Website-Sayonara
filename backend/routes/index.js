var express = require('express');
var router = express.Router();

/* API root */
router.get('/', function(req, res) {
  res.status(200).json({
    status: 'OK',
    message: 'Sayonara API root',
    timestamp: new Date().toISOString()
  });
});

/* Health check endpoint for Render */
router.get('/health', function(req, res) {
  res.status(200).json({
    status: 'OK',
    message: 'Sayonara API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
