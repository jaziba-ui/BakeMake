const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter a email"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Please enter a min of 6 characters"],
  },
  name: { type: String, required: true },
  location: { type: String },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
