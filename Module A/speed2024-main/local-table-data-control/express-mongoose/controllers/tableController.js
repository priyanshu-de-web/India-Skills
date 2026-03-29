const TableData = require('../models/TableData');

/**
 * Table Controller
 * Equivalent to PHP index.php and update.php
 */

// Display table (GET /)
exports.index = async (req, res) => {
    try {
        const tableData = await TableData.getOrCreateDefault();
        
        res.render('index', {
            fields: tableData.fields,
            rows: tableData.rows
        });
    } catch (error) {
        console.error('Error fetching table data:', error);
        res.status(500).send('Error fetching table data');
    }
};

// Handle form submission (POST /update)
exports.update = async (req, res) => {
    try {
        const tableData = await TableData.getOrCreateDefault();
        const { type, fields, rows } = req.body;
        
        if (type === 'add') {
            // Add new row
            await tableData.addRow();
        } else if (type === 'save') {
            // Save all data
            const processedRows = rows ? Object.values(rows) : [];
            await tableData.saveData(fields || [], processedRows);
        } else if (!isNaN(parseInt(type))) {
            // Delete row by index
            const rowIndex = parseInt(type);
            await tableData.deleteRow(rowIndex);
        }
        
        res.redirect('back');
    } catch (error) {
        console.error('Error updating table data:', error);
        res.status(500).send('Error updating table data');
    }
};

// API: Get table data as JSON
exports.getTableJson = async (req, res) => {
    try {
        const tableData = await TableData.getOrCreateDefault();
        res.json({
            success: true,
            data: {
                fields: tableData.fields,
                rows: tableData.rows
            }
        });
    } catch (error) {
        console.error('Error fetching table data:', error);
        res.status(500).json({ success: false, error: 'Error fetching table data' });
    }
};

// API: Add row
exports.addRowJson = async (req, res) => {
    try {
        const tableData = await TableData.getOrCreateDefault();
        await tableData.addRow();
        res.json({ success: true, data: { fields: tableData.fields, rows: tableData.rows } });
    } catch (error) {
        console.error('Error adding row:', error);
        res.status(500).json({ success: false, error: 'Error adding row' });
    }
};

// API: Delete row
exports.deleteRowJson = async (req, res) => {
    try {
        const rowIndex = parseInt(req.params.index);
        const tableData = await TableData.getOrCreateDefault();
        await tableData.deleteRow(rowIndex);
        res.json({ success: true, data: { fields: tableData.fields, rows: tableData.rows } });
    } catch (error) {
        console.error('Error deleting row:', error);
        res.status(500).json({ success: false, error: 'Error deleting row' });
    }
};

// API: Save all data
exports.saveDataJson = async (req, res) => {
    try {
        const { fields, rows } = req.body;
        const tableData = await TableData.getOrCreateDefault();
        await tableData.saveData(fields, rows);
        res.json({ success: true, data: { fields: tableData.fields, rows: tableData.rows } });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ success: false, error: 'Error saving data' });
    }
};
