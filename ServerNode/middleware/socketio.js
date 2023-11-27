const socketIo = require("socket.io");

let io;
const activeSockets = {};

function initIo(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    // Extract user ID from the handshake query

    const userId = socket.handshake.query.userId;

    // Store the socket in activeSockets
    activeSockets[userId] = socket;

    // Emit a welcome message to the connected user

    console.log(`User ${userId} connected`);

    // Handle socket disconnect
    socket.on("disconnect", () => {
      // Remove the disconnected socket from activeSockets
      delete activeSockets[userId];
      console.log(`User ${userId} disconnected`);
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
}

module.exports = {
  initIo,
  getIo,
  activeSockets,
};
