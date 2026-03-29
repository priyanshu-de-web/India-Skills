const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// API Routes (equivalent to PHP route.php)
router.get('/api/get', apiController.get);
router.post('/api/post', apiController.post);
router.put('/api/put', apiController.put);
router.delete('/api/delete', apiController.delete);

// 404 handler
router.use(apiController.notFound);

module.exports = router;
