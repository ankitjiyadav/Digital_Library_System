const Seat = require("../models/seatModel");
const Locker = require("../models/lockerModel");

// Add a seat
exports.addSeat = async (req, res) => {
  const { id } = req.params; // Library ID from URL params
  const { seatNumber, shift, isAvailable } = req.body;

  try {
    const seat = new Seat({
      seatNumber,
      library: id,
      shift,
      isAvailable: isAvailable || true, // Default to true if not provided
    });
    await seat.save();
    res.status(201).json({ message: "Seat added successfully", seat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get seats by library and optional shift
exports.getSeatsByLibrary = async (req, res) => {
  const { id } = req.params;
  const { shift } = req.query;

  try {
    const query = { library: id };
    if (shift) query.shift = shift;

    const seats = await Seat.find(query);
    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update seat status
exports.updateSeatStatus = async (req, res) => {
  const { id, seatId } = req.params;
  const { isAvailable } = req.body;

  try {
    const seat = await Seat.findOneAndUpdate(
      { _id: seatId, library: id },
      { isAvailable },
      { new: true }
    );

    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res.json({ message: "Seat status updated successfully", seat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a locker
exports.addLocker = async (req, res) => {
  const { id } = req.params;
  const { lockerNumber, isAvailable } = req.body;

  try {
    const locker = new Locker({
      lockerNumber,
      library: id,
      isAvailable: isAvailable || true,
    });
    await locker.save();
    res.status(201).json({ message: "Locker added successfully", locker });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get lockers by library
exports.getLockersByLibrary = async (req, res) => {
  const { id } = req.params;

  try {
    const lockers = await Locker.find({ library: id });
    res.json(lockers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update locker status
exports.updateLockerStatus = async (req, res) => {
  const { id, lockerId } = req.params;
  const { isAvailable } = req.body;

  try {
    const locker = await Locker.findOneAndUpdate(
      { _id: lockerId, library: id },
      { isAvailable },
      { new: true }
    );

    if (!locker) {
      return res.status(404).json({ message: "Locker not found" });
    }

    res.json({ message: "Locker status updated successfully", locker });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
