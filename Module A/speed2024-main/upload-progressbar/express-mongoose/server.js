const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const routes = require('./routes');
app.use('/', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Upload Progressbar server running on http://localhost:${PORT}`);
});

module.exports = app;
