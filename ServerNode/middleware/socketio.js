const socketIo = require("socket.io");

let io;

function initIo(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    // Handle socket events here

    socket.on("disconnect", () => {
      console.log("Client disconnected");
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
};
