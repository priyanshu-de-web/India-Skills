const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

// Web routes (render views)
router.get('/', calendarController.index);
router.post('/tasks', calendarController.store);

// API routes (JSON responses)
router.get('/api/tasks', calendarController.getTasksJson);
router.post('/api/tasks', calendarController.createTaskJson);

module.exports = router;
