const express = require("express");
const session = require("express-session");

const authRoutes = require("./server/routes/auth.js");
const uiRoutes = require("./server/routes/ui.js");
const GameServer = require("./server/multiplayer/gameplay_server.js");
// Create the Express app
const app = express();

// Use the session middleware to maintain sessions
const gameSession = session({
  secret: "game",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: null },
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

global.gameServers = {
  1: new GameServer(),
  2: new GameServer(),
  3: new GameServer(),
};
global.sockets = {};

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
    sockets[username] = socket;

    console.log(username + " has connected");
    console.log(onlinePlayerList);

    io.emit("online players", JSON.stringify(onlinePlayerList));
  }

  socket.on("sign out", () => {
    if (socket.request.session.user) {
      const user = socket.request.session.user;
      const { username } = user;
      if (username in onlinePlayerList) {
        delete onlinePlayerList[username];
      }
      delete sockets[username];
      //leave room as well
      for (let i = 1; i <= Object.keys(gameRooms).length; i++) {
        for (let j = 1; j <= 2; j++) {
          if (gameRooms[i][`player${j}`] === username) {
            gameRooms[i][`player${j}`] = null;
          }
        }
      }
      io.emit("online players", JSON.stringify(onlinePlayerList));
      io.emit("game rooms", JSON.stringify(gameRooms));
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
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

  socket.on("click start game", (message) => {
    const { room } = JSON.parse(message);
    let hasEmpty = false;
    for (let i = 1; i <= 2; ++i) {
      if (gameRooms[room][`player${i}`] === null) {
        hasEmpty = true;
      }
    }
    // Start Game only when room is full
    if (!hasEmpty) {
      const user1 = gameRooms[room]["player1"];
      const user2 = gameRooms[room]["player2"];
      const socket1 = sockets[user1];
      const socket2 = sockets[user2];
      gameServers[room].initialize(user1, user2);
      socket1.emit("start game");
      socket2.emit("start game");
    }
  });

  // Given the username, return the gameroom and player
  // expected message: {username: "username"}
  socket.on("get game config", (message) => {
    console.log("get game config socket triggered");
    const username = socket.request.session.user.username;
    let roomNum,
      player = -1;
    for (let i = 1; i <= Object.keys(gameRooms).length; i++) {
      for (let j = 1; j <= 2; j++) {
        if (gameRooms[i][`player${j}`] === username) {
          roomNum = i;
          player = j;
        }
      }
    }

    gameServers[roomNum].setSocket(username, socket);
    toReturn = { roomNum, player };
    console.log("game config : ", toReturn);
    socket.emit("game config", JSON.stringify(toReturn));
  });

  // Given the gameroom, player and command, do the command in the gameroom
  // expected message: {room: 1, player: 1 , command: "updatePos", parameters: {x=123,y=456}}
  socket.on("game command", (message) => {
    const { room, player, command, parameters } = JSON.parse(message);
    if (gameRooms[room]["player1"] && gameRooms[room]["player2"]) {
      gameServers[room].doCommand(command, player, parameters);
    }
  });

  socket.on("game keys", (message) => {
    const { room, player, keyCode, event } = JSON.parse(message);
    io.emit(
      "game keys event",
      JSON.stringify({ room, player, keyCode, event })
    );
  });
  //uitlies
  socket.on("player attack", (message) => {
    const { room, player, direction } = JSON.parse(message);
    // gameServers[room].playerAttackRight(player);
    if (direction === "left") {
      const keyCode = 68;
      io.emit(
        "game keys event",
        JSON.stringify({ room, player, keyCode, event: "attackLeft" })
      );
    } else if (direction === "right") {
      const keyCode = 65;
      io.emit(
        "game keys event",
        JSON.stringify({ room, player, keyCode, event: "attackRight" })
      );
    }
  });

  socket.on("player cheat", (message)=>{
    const { room, player } = JSON.parse(message);
    if(room && player){
      gameServers[room].playerCheat(player);
    }
  });

  socket.on("coin collected", (message) => {
    const { room, player } = JSON.parse(message);
    gameServers[room].playerCollectedCoin(player);
  });
  socket.on("player teleport", (message) => {
    const { room, player, teleporterSteppedOn } = JSON.parse(message);
    gameServers[room].playerTeleported(player, teleporterSteppedOn);
  });
  socket.on("player trap", (message) => {
    const { room, player } = JSON.parse(message);
    console.log(`player ${player} is trapped`);
    gameServers[room].playerTrapped(player);
  });
  socket.on("quit game", (message) => {
    const { room, player } = JSON.parse(message);
    global.gameRooms[room][`player${player}`] = null;
    io.emit("room joint", JSON.stringify(gameRooms));
    gameServers[room].quitGame(player);
  });
  socket.on("player hit", (message) => {
    const { room, player, opponent } = JSON.parse(message);
    console.log(`player ${player} Hit Opponent`);
    gameServers[room].playerHitOpponent(player, opponent);
  });
  socket.on("check gameend", (message) => {
    const { room, player } = JSON.parse(message);
    console.log(room)
    gameServers[room].checkGameEnd();
  });
});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
  console.log("The server has started...");
});
