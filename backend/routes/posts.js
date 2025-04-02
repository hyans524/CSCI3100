const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');

// Setup image upload
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Create a new post
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { user_id, text, location, budget, activities, start_date, end_date } = req.body;

    const newPost = new Post({
      user_id,
      text,
      location,
      budget,
      activities: activities.split(','),
      start_date,
      end_date,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post', detail: err.message });
  }
});

// Get posts with filters + counts
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.location) query.location = req.query.location;
    if (req.query.budget) query.budget = req.query.budget;
    if (req.query.likedBy) query.likes = { $in: [req.query.likedBy] };
    if (req.query.keyword) query.text = { $regex: req.query.keyword, $options: 'i' };

    const posts = await Post.find(query)
      .populate('user_id', 'username')
      .populate('likes', 'username')
      .populate('comments.user_id', 'username');

    const enrichedPosts = posts.map(post => ({
      ...post.toObject(),
      likeCount: post.likes.length,
      commentCount: post.comments.length
    }));

    res.json(enrichedPosts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Update post
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    if (updates.activities) updates.activities = updates.activities.split(',');

    const updated = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Like a post
router.put('/like/:id', async (req, res) => {
  const { userId } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }
    res.json({ success: true, likes: post.likes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Unlike a post
router.put('/unlike/:id', async (req, res) => {
  const { userId } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
      await post.save();
    }
    res.json({ success: true, likes: post.likes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unlike post' });
  }
});

// Comment on a post
router.post('/comment/:id', async (req, res) => {
  const { userId, text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ user_id: userId, text });
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to comment' });
  }
});

module.exports = router;