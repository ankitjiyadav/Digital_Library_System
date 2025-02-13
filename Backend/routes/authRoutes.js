const express = require('express');
const { registerUser, sendOtp, verifyOtp, getUserById, getAllUsers, updateUser,loginUser } = require('../controllers/authController');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const fs = require("fs");
      const uploadDirectory = "uploads";
      if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory);
      }
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Only PDF files are allowed"), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  });

// Routes
router.post('/register', upload.single('aadhaar_document'), registerUser);
router.post('/login',loginUser)
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/get-user', getUserById);
router.get('/getAllUser', getAllUsers);
router.put('/update-user/:id', upload.single('aadhaar_document'), updateUser);

module.exports = router;
