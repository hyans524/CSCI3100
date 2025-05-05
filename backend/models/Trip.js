const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    destination: { type: String, required: true },
    start_date: { type: Date },
    end_date: { type: Date },
    budget: { type: Number },
    activity: { type: [String], default: [] },
    group_id: { type: Number, ref: 'Group', required: true }
});

module.exports = mongoose.model('Trip', TripSchema); 


