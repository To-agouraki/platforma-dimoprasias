const express = require("express");
const bodyParses = require("body-parser");
const mongoose = require("mongoose");

const http = require("http"); // Import http module
const socketIo = require("socket.io"); // Import Socket.IO module
const cors = require("cors"); // Import the cors package



const path = require("path");
const fs = require("fs"); //file system module

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const adminRoutes = require("./routes/admin-routes");
const HttpError = require("./models/http-error");

const corsOptions = {
  origin: '*', // Allow all origins during development, restrict in production
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

const app = express();
const server = http.createServer(app); // Create an HTTP server instance
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors(corsOptions));



app.use(bodyParses.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

//   next();
// });



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
  res.json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect("mongodb+srv://testuser:mongopass@cluster0.vbt4uxc.mongodb.net/mern")
  .then(() => {
    try {
      io.on("connection", (socket) => {
        console.log("Client connected");
  
        // Example: Emit a notification to the connected client
        socket.emit("notification", { message: "Welcome to the server!" });
  
        socket.on("disconnect", () => {
          console.log("Client disconnected");
        });
      });
    } catch (error) {
      console.log(error);
    }
   

    server.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
