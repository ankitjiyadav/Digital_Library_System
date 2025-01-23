const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String },
  aadhaarUrl: { type: String }, // URL of uploaded Aadhaar
});

module.exports = mongoose.model("User", UserSchema);
