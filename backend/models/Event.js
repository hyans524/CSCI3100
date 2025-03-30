const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String},
    presenter: { type: String},
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    date: {type: String}
});

module.exports = mongoose.model('Event', eventSchema); 