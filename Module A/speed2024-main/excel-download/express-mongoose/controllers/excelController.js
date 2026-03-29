const ExcelJS = require('exceljs');
const Post = require('../models/Post');

exports.downloadExcel = async (req, res) => {
    try {
        // Get posts with comment counts
        const posts = await Post.getPostsWithCommentCount();
        
        // Create workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Express + Mongoose';
        workbook.created = new Date();
        
        const worksheet = workbook.addWorksheet('Posts');
        
        // Define columns
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'TITLE', key: 'title', width: 40 },
            { header: 'COMMENT COUNT', key: 'comments_count', width: 20 }
        ];
        
        // Add header styling
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
        
        // Add data rows
        posts.forEach((post, index) => {
            worksheet.addRow({
                id: index + 1,
                title: post.title,
                comments_count: post.comments_count || 0
            });
        });
        
        // Set response headers for Excel download
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=posts.xlsx'
        );
        
        // Write to response
        await workbook.xlsx.write(res);
        res.end();
        
    } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).json({ error: 'Error generating Excel file' });
    }
};

// API endpoint to get posts with comment count as JSON
exports.getPostsJson = async (req, res) => {
    try {
        const posts = await Post.getPostsWithCommentCount();
        res.json({ success: true, data: posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, error: 'Error fetching posts' });
    }
};
