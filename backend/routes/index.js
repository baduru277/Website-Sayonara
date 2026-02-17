// routes/index.js
const express = require('express');
const router = express.Router();

// -------------------- API Root --------------------
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Welcome to Sayonara API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login:    'POST /api/auth/login',
        me:       'GET  /api/auth/me'
      },
      items: {
        list:   'GET    /api/items',
        get:    'GET    /api/items/:id',
        create: 'POST   /api/items',
        update: 'PUT    /api/items/:id',
        delete: 'DELETE /api/items/:id'
      },
      users: {
        dashboard:    'GET /api/users/dashboard',
        profile:      'PUT /api/users/profile',
        subscription: 'GET /api/users/subscription'
      },
      admin: {
        stats:    'GET  /api/admin/dashboard/stats',
        pending:  'GET  /api/admin/subscriptions/pending',
        approve:  'POST /api/admin/subscriptions/:id/approve',
        reject:   'POST /api/admin/subscriptions/:id/reject',
        users:    'GET  /api/admin/users'
      },
      upload: {
        single:   'POST   /api/upload/single',
        multiple: 'POST   /api/upload/multiple',
        avatar:   'POST   /api/upload/avatar',
        delete:   'DELETE /api/upload/delete/:folder/:filename'
      },
      health: 'GET /health'
    }
  });
});

module.exports = router;
