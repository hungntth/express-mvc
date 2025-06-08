const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { redirectIfAuth } = require('../middlewares/auth');

// GET /auth/login
router.get('/login', redirectIfAuth, AuthController.showLogin);

// POST /auth/login
router.post('/login', AuthController.login);

// POST /auth/logout
router.post('/logout', AuthController.logout);

module.exports = router;