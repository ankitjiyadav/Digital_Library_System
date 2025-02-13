const express = require("express");
const {
  addSeat,
  getSeatsByLibrary,
  updateSeatStatus,
  addLocker,
  getLockersByLibrary,
  updateLockerStatus,
} = require("../controllers/seatlockerController");

const router = express.Router();

// Seat Routes
router.post("/libraries/:id/seats", addSeat);
router.get("/libraries/:id/seats", getSeatsByLibrary);
router.put("/libraries/:id/seats/:seatId", updateSeatStatus);

// Locker Routes
router.post("/libraries/:id/lockers", addLocker);
router.get("/libraries/:id/lockers", getLockersByLibrary);
router.put("/libraries/:id/lockers/:lockerId", updateLockerStatus);

module.exports = router;
