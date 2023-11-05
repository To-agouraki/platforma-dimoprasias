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
    const userId = socket.handshake.query.userId;
    console.log(`User ${userId} connected`);
    // Handle socket events here

    socket.join(userId);


    socket.on("disconnect", () => {
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
};
