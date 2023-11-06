const socketIo = require("socket.io");

let io;

const activeSockets = {};

function initIo(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  let useridd;

  io.on("connection", (socket) => {
    socket.on("userConnected", (data) => {
      const userId = data.userId;
      useridd = data.userId;
      activeSockets[userId] = socket;
     // io.to(data.userId).emit("notification", { message: `Welcome to the platform!${data.userId}` });
      console.log(`User ${userId} connected`);
    });

   // socket.join(useridd);

    
    socket.on("disconnect", () => {
      // Remove the disconnected socket from activeSockets
      const userId = getUserIdBySocket(socket);
      if (userId) {
        delete activeSockets[userId];
        console.log(`User ${userId} disconnected`);
      }
    });
  });
}

function getUserIdBySocket(socket) {
  // Find user ID by socket from activeSockets
  const entries = Object.entries(activeSockets);
  for (const [userId, activeSocket] of entries) {
    if (activeSocket === socket) {
      return userId;
    }
  }
  return null;
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
