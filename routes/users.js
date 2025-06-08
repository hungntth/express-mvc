const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET /users
router.get('/', requireAuth, requireAdmin, UserController.index);

// GET /users/create
router.get('/create', requireAuth, requireAdmin, UserController.showCreate);

// POST /users
router.post('/', requireAuth, requireAdmin, UserController.create);

// GET /users/:id/edit
router.get('/:id/edit', requireAuth, requireAdmin, UserController.showEdit);

// PUT /users/:id
router.put('/:id', requireAuth, requireAdmin, UserController.update);

// DELETE /users/:id
router.delete('/:id', requireAuth, requireAdmin, UserController.delete);

module.exports = router;