const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Group = require('../models/Group');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find().lean();
        const groups = await Group.find().lean();
        
        // lookup of groups by group_id
        const groupMap = {};
        groups.forEach(group => {groupMap[group.group_id] = group;});
        
        // Format the trips with group information
        const formattedTrips = trips.map(trip => {
            const group = groupMap[trip.group_id];
            
            return {
                id: trip._id,
                destination: trip.destination,
                start_date: trip.start_date,
                end_date: trip.end_date,
                budget: trip.budget,
                activity: trip.activity,
                group_id: trip.group_id,
                groupName: group ? group.group_name : "Unnamed Group",
                memberCount: group && group.members ? group.members.length : 0,
                hasGroup: !!group,
                member: group.members,
                image: trip.image || null
            };
        });
        
        res.json(formattedTrips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        //console.log(`Fetching trip with ID: ${req.params.id}`);
        
        const trip = await Trip.findById(req.params.id).lean();
        
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        
        let group = null;
        if (trip.group_id) {
            group = await Group.findOne({ group_id: trip.group_id }).lean();
        }
        
        const formattedTrip = {
            _id: trip._id,
            destination: trip.destination,
            start_date: trip.start_date,
            end_date: trip.end_date,
            budget: trip.budget,
            activity: trip.activity,
            group_id: trip.group_id,
            groupName: group ? group.group_name : "Unnamed Group",
            memberCount: group && group.members ? group.members.length : 0,
            image: trip.image || null
        };

        res.json(formattedTrip);
    } catch (error) {
        console.error('Error fetching trip details:', error);
        res.status(500).json({ message: error.message });
    }
});


router.post('/', async (req, res) => {
    const trip = new Trip({
        destination: req.body.destination,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        budget: req.body.budget,
        activity: req.body.activity,
        group_id: req.body.group_id
    });

    try {
        const newTrip = await trip.save();
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (req.body.destination) trip.destination = req.body.destination;
        if (req.body.start_date) trip.start_date = req.body.start_date;
        if (req.body.end_date) trip.end_date = req.body.end_date;
        if (req.body.budget) trip.budget = req.body.budget;
        if (req.body.activity) trip.activity = req.body.activity;
        if (req.body.group_id) trip.group_id = req.body.group_id;
        
        const updatedTrip = await trip.save();
        res.json(updatedTrip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Trip.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        res.json({ message: 'Trip deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 