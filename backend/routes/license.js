const express = require('express');
const router = express.Router();
const License = require('../models/License');

router.get('/', async (req, res) => {
    try {
        const licenses = await License.find();
        res.json(licenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const license = await License.findById(req.params.id);
        if (!license) {
            return res.status(404).json({ message: 'License not found' });
        }
        res.json(license);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const license = new License({
        key: req.body.key
    });

    try {
        const newLicense = await license.save();
        res.status(201).json(newLicense);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: `License key '${req.body.key}' already exists`
            });
        }
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const license = await License.findById(req.params.id);
        if (!license) {
            return res.status(404).json({ message: 'License not found' });
        }

        if (req.body.key) {
            license.key = req.body.key;
        }

        const updatedLicense = await license.save();
        res.json(updatedLicense);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: `License key '${req.body.key}' already exists`
            });
        }
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const license = await License.findById(req.params.id);
        if (!license) {
            return res.status(404).json({ message: 'License not found' });
        }
        await license.remove();
        res.json({ message: 'License deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/key/:key', async (req, res) => {
    try {
        const license = await License.find({key: req.params.key});
        if (!license) {
            res.json()
        }
        res.json(license)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;