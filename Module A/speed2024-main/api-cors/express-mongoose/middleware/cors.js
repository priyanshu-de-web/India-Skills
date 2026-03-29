/**
 * Custom CORS middleware for API
 * Equivalent to the PHP cors.php
 */
const corsMiddleware = (req, res, next) => {
    // Domains to allow CORS
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    
    // HTTP methods to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Headers to allow
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
};

module.exports = corsMiddleware;
