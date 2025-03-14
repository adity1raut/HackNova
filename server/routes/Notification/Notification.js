const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174/", // Frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const assignments = [];

// WebSocket connection
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// API to add a new assignment
app.post("/api/assignments", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and Description are required" });
  }

  const newAssignment = { id: assignments.length + 1, title, description };
  assignments.push(newAssignment);

  // Emit event to notify all connected clients
  io.emit("new-assignment", newAssignment);

  res.status(201).json({ message: "Assignment added successfully", assignment: newAssignment });
});

server.listen(5174, () => {
  console.log("Server is running on port 5174");
});
