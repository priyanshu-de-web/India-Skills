const { getUser, checkUser, checkToken, getBearerToken } = require('../helpers/testHelper');

/**
 * API Controller
 * Equivalent to the PHP controller.php
 */

// GET /api/get
exports.get = (req, res) => {
    const user = getUser();
    
    res.json({
        email: user.email,
        password: user.password,
        message: 'success get'
    });
};

// POST /api/post
exports.post = (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password || !checkUser(email, password)) {
        return res.status(400).json({
            message: 'missing or invalid login value'
        });
    }
    
    const user = getUser();
    
    res.json({
        user_id: user.id,
        message: 'success post'
    });
};

// PUT /api/put
exports.put = (req, res) => {
    const user = getUser();
    const userId = parseInt(req.query.user_id);
    
    if (!userId || userId !== user.id) {
        return res.status(400).json({
            message: 'missing or invalid user id'
        });
    }
    
    res.json({
        token: user.token,
        message: 'success put'
    });
};

// DELETE /api/delete
exports.delete = (req, res) => {
    const token = getBearerToken(req.headers.authorization);
    
    if (!checkToken(token)) {
        return res.status(401).json({
            message: 'missing or invalid token'
        });
    }
    
    res.json({
        message: 'success delete'
    });
};

// 404 Not Found
exports.notFound = (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
};
