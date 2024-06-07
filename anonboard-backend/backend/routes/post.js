const express = require('express');
const Post = require('../models/Post');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    const { title, content, isAnonymous } = req.body; // 요청 본문에서 title, content, isAnonymous를 가져옵니다.
    console.log('Request Body:', req.body); // 로그 추가
    console.log('Authenticated User:', req.user); // 로그 추가
    const post = new Post({
        title,
        content,
        author: req.user.id,
        isAnonymous
    });
    try {
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(400).json({ error: err.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await post.remove();
        res.json({ message: 'Post deleted' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
