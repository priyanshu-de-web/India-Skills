const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadController = require('../controllers/uploadController');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'files');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB limit
    }
});

// Upload route
router.post('/upload', upload.single('file'), uploadController.uploadFile);

// Serve static files
router.use('/files', express.static(uploadDir));

module.exports = router;
