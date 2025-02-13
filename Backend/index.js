// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
const authRoutes = require("./routes/authRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const seatLockerRoutes = require("./routes/seatLockerRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/libraries", libraryRoutes);
app.use("/api/seats-lockers", seatLockerRoutes); // Seat and locker routes

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
