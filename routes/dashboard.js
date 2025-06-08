const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const { requireAuth } = require('../middlewares/auth');

// GET /dashboard
router.get('/', requireAuth, DashboardController.index);

module.exports = router;