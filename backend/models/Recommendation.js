const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecommendationSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    group_id: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
    preferences: {
      location: { type: String, required: true },
      budget: { type: String, required: true },
      duration: { type: Number, required: true },
      activities: [{ type: String, required: true }],
    },
    suggestions: [{ type: String, required: true }],
    createdAt: { type: Date, default: Date.now },
  });

module.exports = mongoose.model('Recommendation', RecommendationSchema);
