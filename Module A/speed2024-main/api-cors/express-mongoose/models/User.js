const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    // For the demo, we're using plain text comparison
    // In production, use bcrypt.compare
    return this.password === candidatePassword;
};

// Generate token
userSchema.methods.generateToken = function() {
    this.token = '==test_token==';
    return this.token;
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        return null;
    }
    const isMatch = await user.comparePassword(password);
    return isMatch ? user : null;
};

// Static method to validate token
userSchema.statics.validateToken = async function(token) {
    return await this.findOne({ token });
};

module.exports = mongoose.model('User', userSchema);
