const mongoose = require('mongoose');

const ExpensesSchema = new mongoose.Schema({
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    paid_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    category: {
        type: String,
        required: true,
        enum: {
          values: ['Food', 'Transport', 'Accommodation', 'Recreation', 'Other'],
          message: 'Invalid expense category',
        },
    },
    description: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Expenses', ExpensesSchema); 
