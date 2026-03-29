const Task = require('../models/Task');

// Helper function to get start of week (Sunday)
function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Helper function to get end of week (Saturday)
function getEndOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() + (6 - day));
    d.setHours(23, 59, 59, 999);
    return d;
}

// Helper function to get first day of month
function getFirstDayOfMonth(year, month) {
    return new Date(year, month - 1, 1);
}

// Helper function to get last day of month
function getLastDayOfMonth(year, month) {
    return new Date(year, month, 0);
}

// Helper function to add days to a date
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Get calendar index with tasks
exports.index = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        
        // Get first and last day of month
        const firstDayOfMonth = getFirstDayOfMonth(year, month);
        const lastDayOfMonth = getLastDayOfMonth(year, month);
        
        // Get calendar range (including previous/next month days)
        const startDate = getStartOfWeek(firstDayOfMonth);
        const endDate = getEndOfWeek(lastDayOfMonth);
        
        // Calculate number of days to display
        const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        // Get all potential tasks for this range
        const allTasks = await Task.getTasksForDateRange(startDate, endDate);
        
        // Build tasks array for each day
        const tasks = [];
        for (let i = 0; i <= diffDays; i++) {
            const currentDate = addDays(startDate, i);
            const dayTasks = allTasks.filter(task => task.occursOn(currentDate));
            tasks.push(dayTasks);
        }
        
        res.render('main', {
            tasks,
            startDate,
            diffDays,
            year,
            month,
            firstDayOfMonth,
            lastDayOfMonth,
            addDays,
            formatDate
        });
    } catch (error) {
        console.error('Error fetching calendar:', error);
        res.status(500).json({ error: 'Error fetching calendar data' });
    }
};

// Create a new task
exports.store = async (req, res) => {
    try {
        const { title, task_date, is_recurring, cycle, type, end_date } = req.body;
        
        const taskData = {
            title,
            task_date: new Date(task_date)
        };
        
        if (is_recurring === 'true') {
            taskData.recurring_cycle = parseInt(cycle);
            taskData.recurring_type = type;
            if (end_date) {
                taskData.recurring_end_date = new Date(end_date);
            }
        }
        
        await Task.create(taskData);
        
        res.redirect('back');
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Error creating task' });
    }
};

// API endpoint to get tasks as JSON
exports.getTasksJson = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        
        const firstDayOfMonth = getFirstDayOfMonth(year, month);
        const lastDayOfMonth = getLastDayOfMonth(year, month);
        const startDate = getStartOfWeek(firstDayOfMonth);
        const endDate = getEndOfWeek(lastDayOfMonth);
        
        const allTasks = await Task.getTasksForDateRange(startDate, endDate);
        
        res.json({
            success: true,
            data: {
                year,
                month,
                startDate,
                endDate,
                tasks: allTasks
            }
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, error: 'Error fetching tasks' });
    }
};

// API endpoint to create task
exports.createTaskJson = async (req, res) => {
    try {
        const { title, task_date, is_recurring, cycle, type, end_date } = req.body;
        
        const taskData = {
            title,
            task_date: new Date(task_date)
        };
        
        if (is_recurring === true || is_recurring === 'true') {
            taskData.recurring_cycle = parseInt(cycle);
            taskData.recurring_type = type;
            if (end_date) {
                taskData.recurring_end_date = new Date(end_date);
            }
        }
        
        const task = await Task.create(taskData);
        
        res.json({ success: true, data: task });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ success: false, error: 'Error creating task' });
    }
};
