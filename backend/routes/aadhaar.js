const express = require('express');
const router = express.Router();

// Placeholder — uncomment when Surepass API key is ready
router.post('/send-otp', (req, res) => res.json({ message: 'Aadhaar verification coming soon' }));
router.post('/verify-otp', (req, res) => res.json({ message: 'Aadhaar verification coming soon' }));

module.exports = router;
