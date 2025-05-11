const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const Trip = require('../models/Trip');
const Group = require('../models/Group');

// Setup image upload
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Create a new post, trip, and group
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { user_id, text, location, budget, activities, start_date, end_date } = req.body;

    // 1. Create a new group
    const groupCount = await Group.countDocuments(); // what is this
    const newGroupId = groupCount + 1;
    
    const newGroup = new Group({
      group_id: newGroupId,
      group_name: `${location} Trip`,
      members: [user_id],
      trip_summary: text
    });
    
    const savedGroup = await newGroup.save();
    
    // 2. Create a new trip
    const newTrip = new Trip({
      destination: location,
      start_date,
      end_date,
      budget: parseInt(budget.split('-')[1]) || 1000, // Use the upper limit of budget range
      activity: activities.split(','),
      group_id: newGroupId
    });
    
    const savedTrip = await newTrip.save();
    
    // 3. Create a new post with reference to the trip
    const newPost = new Post({
      user_id,
      text,
      location,
      budget,
      activities: activities.split(','),
      start_date,
      end_date,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      trip_oid: savedTrip._id // Store reference to the trip
    });

    const savedPost = await newPost.save();
    
    res.status(201).json({
      post: savedPost,
      trip: savedTrip,
      group: savedGroup
    });
  } catch (err) {
    console.error('Error creating post with trip:', err);
    res.status(500).json({ error: 'Failed to create post and trip', detail: err.message });
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

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user_id', 'username')
      .populate('likes', 'username')
      .populate('comments.user_id', 'username');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const enrichedPost = {
      ...post.toObject(),
      likeCount: post.likes.length,
      commentCount: post.comments.length
    };
    
    res.json(enrichedPost);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ error: 'Failed to fetch post' });
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

// Join a trip
router.put('/join/:postId', async (req, res) => {
  const { userId } = req.body;
  
  try {
    // Find the post to get the trip_oid
    const post = await Post.findById(req.params.postId);
    if (!post || !post.trip_oid) {
      return res.status(404).json({ error: 'Trip not found for this post' });
    }
    
    // Find the trip to get the group_id
    const trip = await Trip.findById(post.trip_oid);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    // Find the group and add the user
    const group = await Group.findOne({ group_id: trip.group_id });
    if (!group) {
      return res.status(404).json({ error: 'Group not found for this trip' });
    }
    
    // Check if user is already a member
    if (group.members.some(member => member.toString() === userId)) {
      return res.json({ message: 'User is already a member of this trip', group });
    }
    
    // Add user to group members
    group.members.push(userId);
    await group.save();
    
    res.json({ message: 'Successfully joined the trip', group });
  } catch (err) {
    console.error('Error joining trip:', err);
    res.status(500).json({ error: 'Failed to join trip' });
  }
});

module.exports = router;