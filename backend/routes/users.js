const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const users = await User.findById(req.params.id)
        if (!users) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/', async (req, res) => {
    const user = new User({
        user_id: req.body.user_id,
        username: req.body.username,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
        age: req.body.age,
        phone: req.body.phone,
        gender: req.body.gender,
        language: req.body.language,
        email: req.body.email
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.post('/byids', async (req, res) => {
    try {
        const { userIds } = req.body;
        
        if (!Array.isArray(userIds)) {
            return res.status(400).json({ message: 'userIds must be an array' });
        }
        
        const users = await User.find({ user_id: { $in: userIds } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        Object.assign(user, req.body);
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.deleteOne({ _id: req.params.id }).exec();
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 