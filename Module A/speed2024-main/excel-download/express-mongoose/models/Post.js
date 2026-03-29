const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Virtual for comments count
postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post_id'
});

// Enable virtuals in JSON
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

// Static method to get posts with comment count
postSchema.statics.getPostsWithCommentCount = async function() {
    const Comment = require('./Comment');
    const posts = await this.find().lean();
    
    for (const post of posts) {
        post.comments_count = await Comment.countDocuments({ post_id: post._id });
    }
    
    return posts;
};

module.exports = mongoose.model('Post', postSchema);
