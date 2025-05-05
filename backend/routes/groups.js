const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const groups = await Group.find().populate('members').populate('messages.user_oid');
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            const groupByNumericId = await Group.findOne({ group_id: parseInt(req.params.id) })
                .populate('members').populate('messages.user_oid');
                
            if (groupByNumericId) {
                return res.json(groupByNumericId);
            }
            
            return res.status(404).json({ message: 'Group not found' });
        }
        
        const group = await Group.findById(req.params.id)
            .populate('members').populate('messages.user_oid');
            
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        
        res.json(group);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/by-group-id/:groupId', async (req, res) => {
    try {
        const groupId = parseInt(req.params.groupId);
        if (isNaN(groupId)) {
            return res.status(400).json({ message: 'Invalid group ID format' });
        }
        
        // Find the group
        const group = await Group.findOne({ group_id: groupId }).lean();
        
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        
        // Fetch users for the member IDs
        const User = require('../models/User');
        let populatedMembers = [];
        
        if (Array.isArray(group.members) && group.members.length > 0) {
            // Convert string IDs to proper ObjectIds if needed
            const memberIds = group.members.map(id => {
                return typeof id === 'string' ? id : id.toString();
            });
            
            // Fetch users by their IDs
            populatedMembers = await User.find({ 
                $or: [
                    { _id: { $in: memberIds } },
                    { user_id: { $in: memberIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id)) } }
                ]
            }).lean();
            
            console.log(`Found ${populatedMembers.length} users for ${memberIds.length} member IDs`);
        }
        
        // Also populate message users
        let populatedMessages = [];
        if (Array.isArray(group.messages) && group.messages.length > 0) {
            populatedMessages = await Promise.all(group.messages.map(async (message) => {
                const userId = message.user_oid;
                let user = null;
                
                if (userId) {
                    // Try to find user either by _id or user_id
                    user = await User.findOne({
                        $or: [
                            { _id: userId },
                            { user_id: parseInt(userId.toString(), 10) }
                        ]
                    }).lean();
                }
                
                return {
                    ...message,
                    user: user ? {
                        _id: user._id,
                        username: user.username,
                        email: user.email
                    } : null
                };
            }));
        }
        
        // Return the group with populated members and messages
        res.json({
            ...group,
            members: populatedMembers,
            messages: populatedMessages
        });
    } catch (error) {
        console.error('Error fetching group by group_id:', error);
        res.status(500).json({ message: error.message });
    }
});


router.post('/', async (req, res) => {
    const group = new Group({
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
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        await group.remove();
        res.json({ message: 'Group deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;