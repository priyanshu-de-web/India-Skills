const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/excel_download';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const routes = require('./routes');
app.use('/', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Excel Download server running on http://localhost:${PORT}`);
    console.log(`Visit http://localhost:${PORT}/ to download the Excel file`);
});

module.exports = app;
