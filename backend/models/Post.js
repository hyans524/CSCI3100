const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
  });

const PostSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trip_oid: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  text: { type: String, required: true, trim: true },
  image: { type: String },
  location: { type: String, required: true },
  budget: { type: String, enum: ['0-1000', '1001-3000', '3001-5000', '5001-10000', '10001+'], required: true },
  activities: [{ type: String, required: true }],
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
});

module.exports = mongoose.model('Post', PostSchema);
