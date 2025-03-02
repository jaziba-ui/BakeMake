const socketIo = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      // origin: "*",
      origin: "http://localhost:3000/admin-dash", // Your frontend URL
      methods: ["GET", "POST"],
      credentials: true, // This allows cookies to be passed for cross-origin requests
    },
    transports: ["websocket", "polling"], // Always ensure these are in place for socket connection
  });

  console.log("Socket.io initialized!");

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);
    
    // Example for handling errors explicitly
    socket.on("error", (error) => {
      console.error("Socket.io Error:", error);
    });

    socket.on("disconnect", () => {
      console.warn("❌ Disconnected from server. Trying to reconnect...");
      setTimeout(() => {
        // socket.connect();
      }, 3000);
    });    
  });

  io.on("connection_error", (err) => {
    console.error("Connection error:", err);
  });
};

const getIo = () => {
  if (!io) {
    console.error("Socket.io is not initialized yet!");
    return null; 
  }
  return io;
};

module.exports = { initializeSocket, getIo };
