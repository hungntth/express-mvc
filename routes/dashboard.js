const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const { requireAuth } = require('../middleware/auth');

// GET /dashboard
router.get('/', requireAuth, DashboardController.index);

module.exports = router;