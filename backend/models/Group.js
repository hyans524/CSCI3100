const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    group_name: { type: String, required: true },
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    trip_summary: { type: mongoose.Schema.Types.Mixed },
    messages: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }]
});

module.exports = mongoose.model('Group', GroupSchema); 
