const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const validateToken = require("../middleware/userVerification");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// Save order data after payment (to be called after Stripe payment success)
router.post("/orderData", async (req, res) => {
  let { order_data, email, order_date } = req.body;
  // Add the order_date directly into the order data
  order_data.unshift({ order_date });
  console.log("Order data before saving:", order_data);
  
  try {
    await Order.findOneAndUpdate(
      { email: email },
      { $push: { order_data: { $each: order_data } } }
    );
    console.log("Order data received:", order_data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get order data for the user
router.post("/myOrderData", async (req, res) => {
  try {
    let eId = await Order.findOne({ email: req.body.email });
    res.json({ orderData: eId });
    console.log(eId);
  } catch (error) {
    res.send("Server Error", error.message);
  }
});

// Create a checkout session with Stripe
router.post("/create-checkout-session",validateToken, async (req, res) => {
  const { products } = req.body;

  // Validate `products`
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Invalid products data" });
  }

  const lineItems = products.map((product) => {
    if (!product.name || !product.img || !product.price || !product.qty) {
      throw new Error("Product data is incomplete");
    }

    return {
      price_data: {
        currency: "chf",
        product_data: {
          name: product.name,
          images: [product.img], // Correcting "image" to "images" as Stripe expects an array
        },
        unit_amount: Math.round(product.price*100), // Amount in cents
      },
      quantity: product.qty,
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success", // Redirect to this URL after successful payment
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Route to handle success and save order data after payment
router.post("/saveOrderAfterPayment",  async (req, res) => {
  const { email, order_data } = req.body;


  // Ensure that the order data is valid (filter out incomplete data)
  const validOrderData = order_data.filter(item => 
    item.name && item.qty && item.price
  );

  console.log(validOrderData)

  if (validOrderData.length !== order_data.length) {
    console.warn('Some invalid order data was filtered out.');
  }

  // Check if there is any valid data to save
  if (validOrderData.length === 0) {
    return res.status(400).json({ message: "No valid order data found." });
  }

  try {
    // Save the valid order data to the user's order history
    const updatedOrder = await Order.findOneAndUpdate(
      { email: email },
      { $push: { orderData: { $each: validOrderData } } }, // Push only valid order data
      { new: true, upsert: true } // To return the updated document if it doesn't exist
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found for the provided email." });
    }

    console.log("Updated Order:", updatedOrder);
    res.json({ success: true, message: "Order saved successfully" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Failed to save order", error: error.message });
  }
});



module.exports = router;
