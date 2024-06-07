const express = require('express');
const Comment = require('../models/Comment');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    const { postId, content, isAnonymous } = req.body;
    console.log('Request Body:', req.body); // 로그 추가
    console.log('Authenticated User:', req.user); // 로그 추가
    const comment = new Comment({
        post: postId,
        author: req.user.id, // Ensure this is correctly set
        content,
        isAnonymous
    });
    try {
        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        console.error('Error creating comment:', err);
        res.status(400).json({ error: err.message });
    }
});

router.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await Comment.find({ post: postId }).populate('author', 'username');
        res.json(comments);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await comment.deleteOne(); // 수정된 부분
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;
