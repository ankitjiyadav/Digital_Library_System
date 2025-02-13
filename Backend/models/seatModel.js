const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true },
    library: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true },
    isAvailable: { type: Boolean, default: true },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

module.exports = mongoose.model('Seat', seatSchema);
