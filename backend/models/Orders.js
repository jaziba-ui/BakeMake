const mongoose = require("mongoose");
const User = require("./User"); // Import the User model

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderData: [
    {
      name: String,
      qty: Number,
      price: Number,
    },
  ],
  status: {
    type: String,
    // enum: ["waiting", "completed"],
    default: "waiting",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
