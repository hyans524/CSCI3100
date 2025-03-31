const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    preferences: { type: Schema.Types.Mixed },
    suggestions: { type: [Schema.Types.Mixed], required: true },
});

module.exports = mongoose.model('Recommendation', RecommendationSchema); 

