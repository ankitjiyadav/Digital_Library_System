const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema({
    lockerNumber: { type: String, required: true },
    library: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true },
    isAvailable: { type: Boolean, default: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

module.exports = mongoose.model('Locker', lockerSchema);
