const express = require('express');
const corsMiddleware = require('./middleware/cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom CORS middleware (equivalent to cors.php)
app.use(corsMiddleware);

// Routes
const routes = require('./routes');
app.use('/', routes);

// Start server
app.listen(PORT, () => {
    console.log(`API CORS server running on http://localhost:${PORT}`);
    console.log('');
    console.log('Available endpoints:');
    console.log(`  GET    http://localhost:${PORT}/api/get`);
    console.log(`  POST   http://localhost:${PORT}/api/post`);
    console.log(`  PUT    http://localhost:${PORT}/api/put?user_id=128`);
    console.log(`  DELETE http://localhost:${PORT}/api/delete`);
    console.log('');
    console.log('Test credentials:');
    console.log('  Email: user@skill.com');
    console.log('  Password: PassworD!1');
    console.log('  Token: ==test_token==');
});

module.exports = app;
