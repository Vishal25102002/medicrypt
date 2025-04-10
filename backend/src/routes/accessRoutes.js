// src/routes/accessRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { requestAccessController, grantAccessController } = require('../controllers/accessController');

router.post('/request', authMiddleware, requestAccessController);
router.post('/grant', authMiddleware, grantAccessController);

module.exports = router;
