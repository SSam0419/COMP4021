const uiRoutes = require("./server/routes/ui.js");
const authRoutes = require("./server/routes/auth.js");

const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/", uiRoutes);

// Use the session middleware to maintain sessions
const chatSession = session({
  secret: "game",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 300000 },
});
app.use(chatSession);

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);

io.use((socket, next) => {
  chatSession(socket.request, {}, next);
});

const onlineUserList = {};
io.on("connection", (socket) => {});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
  console.log("The server has started...");
});
