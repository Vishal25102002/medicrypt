// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { siweLoginController } = require('../controllers/authController');

router.post('/login', siweLoginController);

module.exports = router;
