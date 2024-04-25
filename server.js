const express = require("express");
const session = require("express-session");

const authRoutes = require("./server/routes/auth.js");
const uiRoutes = require("./server/routes/ui.js");

// Create the Express app
const app = express();

// Use the session middleware to maintain sessions
const gameSession = session({
  secret: "game",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 300000 },
});
app.use(gameSession);

// Use the 'public' folder to serve static files
app.use(express.static("public"));

global.onlinePlayerList = {};
//store the username of the player who is in the game room
global.gameRooms = {
  1: { player1: null, player2: null },
  2: { player1: null, player2: null },
  3: { player1: null, player2: null },
};

// Use the json middleware to parse JSON data
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/", uiRoutes);

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);

io.use((socket, next) => {
  gameSession(socket.request, {}, next);
});

io.on("connection", (socket) => {
  if (socket.request.session.user) {
    const user = socket.request.session.user;
    const { username } = user;
    onlinePlayerList[username.toString()] = { username };

    console.log(username + " has connected");
    console.log(onlinePlayerList);

    io.emit("online players", JSON.stringify(onlinePlayerList));
  }

  socket.on("disconnect", () => {
    if (socket.request.session.user) {
      const user = socket.request.session.user;
      const { username } = user;
      if (username in onlinePlayerList) {
        delete onlinePlayerList[username];
      }
      io.emit("remove player", JSON.stringify(user));
    }
  });

  socket.on("get online players", () => {
    socket.emit("online players", JSON.stringify(onlinePlayerList));
  });

  socket.on("get game rooms", () => {
    socket.emit("game rooms", JSON.stringify(gameRooms));
  });

  //expected message: {room: 1, slot: "1" , username: "username"}
  socket.on("join room", (message) => {
    const { room, slot, username } = JSON.parse(message);
    console.log(username + " has joined room " + room + " in slot " + slot);
    let playerSlot = `player${slot}`;
    if (gameRooms[room][playerSlot] === null) {
      //leave old room
      // loop each rooms

      for (let i = 1; i <= Object.keys(gameRooms).length; i++) {
        for (let j = 1; j <= 2; j++) {
          if (gameRooms[i][`player${j}`] === username) {
            gameRooms[i][`player${j}`] = null;
          }
        }
      }
      //join new room
      gameRooms[room][playerSlot] = username;

      console.log(gameRooms);
      io.emit("room joint", JSON.stringify(gameRooms));
    }
  });
});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
  console.log("The server has started...");
});
