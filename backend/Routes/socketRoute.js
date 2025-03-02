const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const User = require("../models/User");
const { getIo } = require("../socket");

 router.post("/socket-orders", async (req, res) => {
    try {
      console.log("Request Body:", req.body);
      const io = getIo()
      console.log("IO Instance:", io)

      const { user, email, orderData } = req.body;

      const existingUser = await User.findById(user);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const newOrder = await Order.create({ email, user, orderData });
      // Emit the new order event
      console.log("🔴 New Order Created:", newOrder);
      io.emit("newOrder", newOrder);

      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error message:", error.message);
      res.status(500).json({ error: "Error creating order", details: error.message });
    }
  });

  router.get('/test-socket', (req, res) => {
    const io = getIo();
    io.emit("newOrder", { id: "test123", item: "Dummy Order" });
    console.log("IO Instance:", io)
    res.send("Emitted Test Order");
  });
  

module.exports =  router; // Return the router
