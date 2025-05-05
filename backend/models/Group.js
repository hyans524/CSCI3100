const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    group_id:{type: Number, required: true, unique: true},
    group_name: { type: String, required: true },
    members: [{type: Number, ref: 'User', required: true }],
    trip_summary: { type: mongoose.Schema.Types.Mixed },
    messages: [{
        user_oid: {
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
