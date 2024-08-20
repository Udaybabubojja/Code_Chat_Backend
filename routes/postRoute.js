const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

router.post('/create', async (req, res) => {
    const { userId, email, problemStatement, code, error } = req.body;
    // Validate the input
    if (!userId || !email || !problemStatement || !code || !error) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const newPost = new Post({
            userId,
            email,
            problemStatement,
            code,
            error
        });

        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ error: 'Error creating post' });
    }
});


module.exports = router;
