/**
 * Test helper functions
 * Equivalent to the PHP testHelper.php
 */

// Default test user (simulating database)
const defaultUser = {
    id: 128,
    email: 'user@skill.com',
    password: 'PassworD!1',
    token: '==test_token=='
};

// Get user data
function getUser() {
    return { ...defaultUser };
}

// Check user credentials
function checkUser(email, password) {
    const user = getUser();
    return email === user.email && password === user.password;
}

// Validate token
function checkToken(token) {
    const user = getUser();
    return token === user.token;
}

// Extract Bearer token from Authorization header
function getBearerToken(authHeader) {
    if (!authHeader) {
        return null;
    }
    const match = authHeader.match(/Bearer\s+(\S+)/);
    return match ? match[1] : null;
}

module.exports = {
    getUser,
    checkUser,
    checkToken,
    getBearerToken
};
