const mongoose = require('mongoose');

/**
 * TableData Schema
 * Stores dynamic table structure with fields and rows
 * Equivalent to the JSON file structure in PHP version
 */
const tableDataSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'default',
        unique: true
    },
    fields: [{
        type: String
    }],
    rows: [[{
        type: String
    }]],
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Static method to get or create default table
tableDataSchema.statics.getOrCreateDefault = async function() {
    let table = await this.findOne({ name: 'default' });
    
    if (!table) {
        // Create default table with sample data
        table = await this.create({
            name: 'default',
            fields: ['first name', 'last name', 'age', 'country', 'gender'],
            rows: [
                ['Park', 'Seokgil', '19', 'Korea', 'male'],
                ['Jude', 'Harris', '27', 'United States', 'male'],
                ['Maci', 'Farrell', '23', 'France', 'female']
            ]
        });
    }
    
    return table;
};

// Method to add a row
tableDataSchema.methods.addRow = async function() {
    const emptyRow = this.fields.map(() => '');
    this.rows.push(emptyRow);
    this.updated_at = new Date();
    return await this.save();
};

// Method to delete a row
tableDataSchema.methods.deleteRow = async function(rowIndex) {
    if (rowIndex >= 0 && rowIndex < this.rows.length) {
        this.rows.splice(rowIndex, 1);
        this.updated_at = new Date();
        return await this.save();
    }
    return this;
};

// Method to update all data
tableDataSchema.methods.saveData = async function(fields, rows) {
    this.fields = fields;
    this.rows = rows;
    this.updated_at = new Date();
    return await this.save();
};

module.exports = mongoose.model('TableData', tableDataSchema);
