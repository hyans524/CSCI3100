const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find().populate('group_id');
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const trips = await Trip.findById(req.params.id).populate('group_id');
        if (!trips) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json(trips);
    } catch (error) {
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

        Object.assign(trip, req.body);
        const updatedTrip = await trip.save();
        res.json(updatedTrip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        await trip.deleteOne({ _id: req.params.id }).exec();
        res.json({ message: 'Trip deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 