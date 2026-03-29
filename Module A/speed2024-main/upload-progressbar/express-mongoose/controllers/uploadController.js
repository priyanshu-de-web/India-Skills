const path = require('path');

/**
 * Upload Controller
 * Equivalent to PHP upload.php
 */

exports.uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.json({
                message: 'fail',
                error: 'No file uploaded'
            });
        }
        
        const fileName = req.file.filename;
        const filePath = `./files/${fileName}`;
        
        res.json({
            message: 'success',
            file_name: filePath,
            original_name: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.json({
            message: 'fail',
            error: error.message
        });
    }
};
