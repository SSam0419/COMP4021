const Socket = (function () {
  // This stores the current Socket.IO socket
  let socket = null;

  // This function gets the socket from the module
  const getSocket = function () {
    return socket;
  };

  // This function connects the server and initializes the socket
  const connect = function () {
    socket = io();
    console.log("Connecting to the server");
    // Wait for the socket to connect successfully
    socket.on("connect", () => {
      console.log("Connected to the server");

      socket.emit("get online players");
    });

    socket.on("online players", (message) => {
      const onlinePlayers = JSON.parse(message);
      console.log(onlinePlayers);
      GameRooms.updateOnlinePlayers(onlinePlayers);
    });

    socket.on("room joint", (message) => {
      const gameRooms = JSON.parse(message);
      console.log(gameRooms);
      GameRooms.updateGameRooms(gameRooms);
    });
  };

  const disconnect = function () {
    socket.disconnect();
    socket = null;
  };

  const joinRoom = function (room, slot, username) {
    console.log("Emitting " + room + " - Player " + slot);
    var message = {
      room,
      slot,
      username,
    };
    socket.emit("join room", JSON.stringify(message));
  };

  return { getSocket, connect, disconnect, joinRoom };
})();
