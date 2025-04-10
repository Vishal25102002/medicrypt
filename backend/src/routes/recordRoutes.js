// src/routes/recordRoutes.js
const express = require('express');
const router = express.Router();

// 1) Auth middleware import
const { authMiddleware } = require('../middleware/auth');

// 2) Multer import and instantiation
const multer = require('multer');
const upload = multer(); // This line is crucial so `upload.single` is a function

// 3) Controller import
const { uploadRecordController, getRecordController } = require('../controllers/recordController');

// 4) Routes

router.post('/', authMiddleware, upload.single('file'), uploadRecordController);
router.get('/:recordId', authMiddleware, getRecordController);

module.exports = router;
