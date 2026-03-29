const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    task_date: {
        type: Date,
        required: true
    },
    recurring_cycle: {
        type: Number,
        default: null
    },
    recurring_type: {
        type: String,
        enum: ['D', 'W', 'M', 'Y', null],
        default: null
    },
    recurring_end_date: {
        type: Date,
        default: null
    }
});

// Helper method to check if a task occurs on a specific date
taskSchema.methods.occursOn = function(targetDate) {
    const taskDate = new Date(this.task_date);
    const target = new Date(targetDate);
    
    // Reset time to compare dates only
    taskDate.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    // Non-recurring task - exact match
    if (!this.recurring_cycle) {
        return taskDate.getTime() === target.getTime();
    }
    
    // Target date must be >= task_date
    if (target < taskDate) {
        return false;
    }
    
    // Check end date if set
    if (this.recurring_end_date) {
        const endDate = new Date(this.recurring_end_date);
        endDate.setHours(0, 0, 0, 0);
        if (target > endDate) {
            return false;
        }
    }
    
    const cycle = this.recurring_cycle;
    
    switch (this.recurring_type) {
        case 'D': // Daily
            const daysDiff = Math.floor((target - taskDate) / (1000 * 60 * 60 * 24));
            return daysDiff % cycle === 0;
            
        case 'W': // Weekly
            const weeksDiff = Math.floor((target - taskDate) / (1000 * 60 * 60 * 24 * 7));
            const sameDayOfWeek = target.getDay() === taskDate.getDay();
            return sameDayOfWeek && (weeksDiff % cycle === 0);
            
        case 'M': // Monthly
            const monthsDiff = (target.getFullYear() - taskDate.getFullYear()) * 12 + 
                              (target.getMonth() - taskDate.getMonth());
            if (monthsDiff < 0 || monthsDiff % cycle !== 0) {
                return false;
            }
            // Check day matches or is last day of month
            const taskDay = taskDate.getDate();
            const targetDay = target.getDate();
            const lastDayOfTargetMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
            
            if (taskDay === targetDay) {
                return true;
            }
            // If task day exceeds last day of target month, show on last day
            if (taskDay > lastDayOfTargetMonth && targetDay === lastDayOfTargetMonth) {
                return true;
            }
            return false;
            
        case 'Y': // Yearly
            const yearsDiff = target.getFullYear() - taskDate.getFullYear();
            if (yearsDiff < 0 || yearsDiff % cycle !== 0) {
                return false;
            }
            // Check month and day match
            if (target.getMonth() !== taskDate.getMonth()) {
                return false;
            }
            const taskDayY = taskDate.getDate();
            const targetDayY = target.getDate();
            const lastDayOfTargetMonthY = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
            
            if (taskDayY === targetDayY) {
                return true;
            }
            // Handle leap year / end of month edge cases
            if (taskDayY > lastDayOfTargetMonthY && targetDayY === lastDayOfTargetMonthY) {
                return true;
            }
            return false;
            
        default:
            return false;
    }
};

// Static method to get tasks for a date range
taskSchema.statics.getTasksForDateRange = async function(startDate, endDate) {
    const tasks = await this.find({
        $or: [
            // Non-recurring tasks in range
            {
                recurring_cycle: null,
                task_date: { $gte: startDate, $lte: endDate }
            },
            // Recurring tasks that might appear in range
            {
                recurring_cycle: { $ne: null },
                task_date: { $lte: endDate },
                $or: [
                    { recurring_end_date: null },
                    { recurring_end_date: { $gte: startDate } }
                ]
            }
        ]
    });
    
    return tasks;
};

module.exports = mongoose.model('Task', taskSchema);
