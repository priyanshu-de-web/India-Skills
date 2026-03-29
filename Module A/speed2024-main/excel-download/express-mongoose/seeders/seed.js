const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/excel_download';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Clear existing data
        await Post.deleteMany({});
        await Comment.deleteMany({});
        console.log('Cleared existing data');
        
        // Create sample posts
        const posts = await Post.create([
            { title: 'First Post Title', content: 'Content of first post' },
            { title: 'Second Post Title', content: 'Content of second post' },
            { title: 'Third Post Title', content: 'Content of third post' },
            { title: 'Fourth Post Title', content: 'Content of fourth post' },
            { title: 'Fifth Post Title', content: 'Content of fifth post' }
        ]);
        console.log('Created posts:', posts.length);
        
        // Create sample comments
        const comments = await Comment.create([
            { post_id: posts[0]._id, content: 'Comment 1 on post 1', author: 'User 1' },
            { post_id: posts[0]._id, content: 'Comment 2 on post 1', author: 'User 2' },
            { post_id: posts[0]._id, content: 'Comment 3 on post 1', author: 'User 3' },
            { post_id: posts[1]._id, content: 'Comment 1 on post 2', author: 'User 1' },
            { post_id: posts[2]._id, content: 'Comment 1 on post 3', author: 'User 2' },
            { post_id: posts[2]._id, content: 'Comment 2 on post 3', author: 'User 3' },
            { post_id: posts[3]._id, content: 'Comment 1 on post 4', author: 'User 1' },
            { post_id: posts[3]._id, content: 'Comment 2 on post 4', author: 'User 2' },
            { post_id: posts[3]._id, content: 'Comment 3 on post 4', author: 'User 3' },
            { post_id: posts[3]._id, content: 'Comment 4 on post 4', author: 'User 4' }
        ]);
        console.log('Created comments:', comments.length);
        
        console.log('Database seeded successfully!');
        console.log('Posts with comment counts:');
        
        const postsWithCounts = await Post.getPostsWithCommentCount();
        postsWithCounts.forEach(post => {
            console.log(`  - ${post.title}: ${post.comments_count} comments`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
