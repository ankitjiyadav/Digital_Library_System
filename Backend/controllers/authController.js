const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");

require("dotenv").config();

// User Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, mobile_number, aadhaar_number, password, role } = req.body;
    console.log("Received Data:", req.body); // Debugging ke liye

    // ✅ Role validation
    if (!["student", "libraryManager", "superAdmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      mobile_number,
      aadhaar_number,
      password: hashedPassword,
      role,
      aadhaar_document: req.file ? req.file.path : null,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// User Login (Email & Password or OTP)
const loginUser = async (req, res) => {
  try {
    const { email, password, mobile_number, otp, role } = req.body;

    let user;
    if (email && password) {
      user = await User.findOne({ email });
      if (!user || user.role !== role) {
        return res.status(400).json({ message: "Invalid email or role." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });
    } 
    else if (mobile_number && otp) {
      user = await User.findOne({ mobile_number });
      if (!user || user.role !== role) {
        return res.status(400).json({ message: "Invalid mobile number or role." });
      }

      if (user.otp !== otp || user.isOtpExpired()) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
      }

      user.otp = null;
      user.otpCreatedAt = null;
      await user.save();
    } 
    else {
      return res.status(400).json({ message: "Invalid login credentials." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Optionally add filters, e.g., { role: 'student' }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from the URL
    const { name, mobile_number, password, role, aadhaar_number } = req.body;
    const aadhaar_document = req.file ? req.file.path : null;

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    // Update user details
    user.name = name || user.name;
    user.mobile_number = mobile_number || user.mobile_number;
    user.password = hashedPassword;
    user.role = role || user.role;
    user.aadhaar_number = aadhaar_number || user.aadhaar_number;
    user.aadhaar_document = aadhaar_document || user.aadhaar_document;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send OTP for Login
const sendOtp = async (req, res) => {
  try {
    const { mobile_number } = req.body;

    if (!mobile_number) {
      return res.status(400).json({ message: "Mobile number is required." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.findOne({ mobile_number });

    if (!user) {
      user = new User({ mobile_number, otp, otpCreatedAt: Date.now(), role: "student" });
    } else {
      user.otp = otp;
      user.otpCreatedAt = Date.now();
    }

    await user.save();

    res.status(200).json({ message: "OTP sent successfully.", otp });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { mobile_number, otp } = req.body;
    const user = await User.findOne({ mobile_number });

    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.otp !== otp || user.isOtpExpired()) return res.status(400).json({ message: "Invalid or expired OTP." });

    user.otp = null;
    user.otpCreatedAt = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, sendOtp, verifyOtp, getUserById, getAllUsers, updateUser,loginUser };
