const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const Users = await User.find().exec()
        let max = 0;
        Users.forEach(user => {
            if (user.user_id > max) {
                max = user.user_id;
            }
        });

        // Create new user
        const user = new User({
            username: username,
            password: password,
            user_id: max + 1,
            isAdmin: false
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { useroid: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, useroid: user._id, isAdmin: user.isAdmin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { useroid: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, useroid: user._id, isAdmin: user.isAdmin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 