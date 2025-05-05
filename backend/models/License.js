const mongoose = require('mongoose');

const LicenseSchema = new mongoose.Schema({
    key: { type: String, required: true,  unique: true },
});

module.exports = mongoose.model('License', LicenseSchema); 
