const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const adminRoutes = require("./routes/admin-routes");
const HttpError = require("./models/http-error");

const corsOptions = {
  origin: "*", // Allow all origins during development, restrict in production
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  next(error);
});

app.use((error, req, res, next) => {
  if (res.file) {
    fs.unlink(req.file.path, (error) => {
      console.log(error);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

io.on("connection", (socket) => {
  console.log("Client connected");

  // Example: Emit a notification to the connected client
  socket.emit("notification", { message: "Welcome to the server!" });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

mongoose
  .connect("mongodb+srv://testuser:mongopass@cluster0.vbt4uxc.mongodb.net/mern")
  .then(() => {
    console.log("MongoDB connected");
    server.listen(5000, () => {
      console.log("Server listening on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  app,
  io,
};
