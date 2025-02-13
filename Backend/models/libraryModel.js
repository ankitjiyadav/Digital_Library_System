const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  openingHours: String,
  fees: Number,
  totalSeats: Number,
  availableSeats: Number,
  lockersAvailable: Number,
  availability: Boolean,
  shifts: [String],
});

module.exports = mongoose.model("Library", librarySchema);
