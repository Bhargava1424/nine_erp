const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    branchName: { type: String, required: true },
    branchCode: { type: String, required: true, unique: true },
    branchAddress: { type: String, required: true }
});

module.exports = mongoose.model('Branch', branchSchema);
