const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile_number: { type: String, required: true },
  aadhaar_number: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "libraryManager", "superAdmin"],
    required: true,
  },
  aadhaar_document: { type: String },
  otp: { type: String },
  otpCreatedAt: { type: Date },
});

// ✅ Corrected: Use `UserSchema` instead of `userSchema`
UserSchema.methods.isOtpExpired = function () {
  const otpExpiryTime = 10 * 60 * 1000; // OTP valid for 10 minutes
  return Date.now() - this.otpCreatedAt > otpExpiryTime;
};

// ✅ Corrected: Use `UserSchema` instead of `userSchema`
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
