const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// Web routes (render views)
router.get('/', tableController.index);
router.post('/update', tableController.update);

// API routes (JSON responses)
router.get('/api/table', tableController.getTableJson);
router.post('/api/table/row', tableController.addRowJson);
router.delete('/api/table/row/:index', tableController.deleteRowJson);
router.put('/api/table', tableController.saveDataJson);

module.exports = router;
