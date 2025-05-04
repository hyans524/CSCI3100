const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const groups = await Group.find().populate('members').
        populate('messages.user_oid');
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const groups = await Group.find().populate('members').
        populate('messages.user_oid');
        if (!groups) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/', async (req, res) => {
    const group = new Group({
        group_id: req.body.group_id,
        group_name: req.body.group_name,
        members: req.body.members,
        trip_summary: req.body.trip_summary,
        messages: req.body.messages
    });
    try {
        const newGroup = await group.save();
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        Object.assign(group, req.body);
        const updatedGroup = await group.save();
        res.json(updatedGroup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.id }).exec();
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        await group.deleteOne({ _id: req.params.id }).exec();
        res.json({ message: 'Group deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 