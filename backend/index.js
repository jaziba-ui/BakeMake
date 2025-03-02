const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const mongoDB = require("./db");
const { initializeSocket } = require("./socket");
const app = express();
const server = http.createServer(app);
// const io = require('socket.io')(server);

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 Unhandled Rejection:", reason);
});

// Whenever a new order is created, emit the 'newOrder' event
app.post('/create-order', (req, res) => {
  console.log("New order request:", req.body);
  const newOrder = createOrder(req.body);
  getIo().emit('newOrder', newOrder);  
  console.log('Emitting newOrder:', newOrder);
  res.status(200).json(newOrder);
});


// Initialize the app and HTTP server

// MongoDB connection
mongoDB().catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));
app.use("/api", require("./Routes/adminOrder"));
app.use("/api", require("./Routes/socketRoute"));


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Socket server is up and running!");
  initializeSocket(server);
});


// Export the server and io instance
module.exports =  {server} ;
