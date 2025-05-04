const mongoose = require('mongoose');

const LicenseSchema = new mongoose.Schema({
    key: { type: String, required: true,  unique: true },
    status: { 
        type: String,
        enum: {
            values: ['ctive', 'used', 'expired']
        }
    },
    issued_to: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('License', LicenseSchema); 


