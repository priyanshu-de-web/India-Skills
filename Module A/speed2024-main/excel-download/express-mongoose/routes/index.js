const express = require('express');
const router = express.Router();
const excelController = require('../controllers/excelController');

// Download Excel file
router.get('/', excelController.downloadExcel);
router.get('/download', excelController.downloadExcel);

// API endpoint for JSON
router.get('/api/posts', excelController.getPostsJson);

module.exports = router;
