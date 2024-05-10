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
    socket.on("connect", () => {
      socket.emit("get online players");
    });

    socket.on("online players", (message) => {
      if (!GameRooms) return;
      const onlinePlayers = JSON.parse(message);
      GameRooms.updateOnlinePlayers(onlinePlayers);
    });

    socket.on("game rooms", (message) => {
      if (!GameRooms) return;
      const gameRooms = JSON.parse(message);
      GameRooms.updateGameRooms(gameRooms);
    });

    socket.on("room joint", (message) => {
      if (!GameRooms) return;
      const gameRooms = JSON.parse(message);
      GameRooms.updateGameRooms(gameRooms);
    });

    socket.on("game config", (message) => {
      if (!GameroomConfig) return;
      const { roomNum, player } = JSON.parse(message);
      GameroomConfig.setConfig(roomNum, player);
    });

    socket.on("game stat", (message) => {
      if (!GameObjectsConfig) return;
      const {
        gameStartTime,
        coinCoord,
        teleporterCoord,
        trapCoord,
        playerCoord,
        score,
        isGameEnd,
        playerCheating
      } = JSON.parse(message);
      GameObjectsConfig.setConfig(
        gameStartTime,
        coinCoord,
        teleporterCoord,
        trapCoord,
        playerCoord,
        score,
        isGameEnd,
        playerCheating
      );
    });

    socket.on("start game", (message) => {
      window.location.href = "/game-play";
    });

    socket.on("game end", (message) => {
      const { score, playerCheatRecord } = JSON.parse(message);
      const { roomNum, playerSlot } = GameroomConfig.getConfig();
      console.log("Game Over");
      console.log(JSON.parse(message));
      $("#gameover-score-1").text(`Score : ${score.score1}`)
      $("#gameover-score-2").text(`Score : ${score.score2}`)
      const $text = $("#game-over-overlay #game-over-message");
      const $description = $("#game-over-description")
      if (playerSlot === 1) {
        if (score.score1 > score.score2) {
            if(!playerCheatRecord[1]){
              if (score.score1 < 30) {
                $text.text("Time's up! You won!");
                $text.attr("class", "text-success");
                $description.text("🌓✨ “As the last rays of twilight fade, you emerge victorious!” 🌓✨");
                $description.attr("class", "text-success");
              } else {
                $text.text("You got 30 coins! You won!");
                $text.attr("class", "text-success");
                $description.text("🌓✨ “With 30 coins in hand, you transcend mortal boundaries and become the true Twilight Champion!” 🌓✨");
                $description.attr("class", "text-success");
              }
          }else{
            $text.text("You Won ?");
            $text.attr("class", "text-danger");
            $description.text("“By some twist of fate, you emerge triumphant. But is it skill or sorcery that guides your hand? The Twin Monarchs raise an eyebrow, questioning your path to victory.” ❓❓❓");
            $description.attr("class", "text-danger");
          }
        } else {
          if (score.score2 < 30) {
            $text.text("Time's up! You lost.");
            $text.attr("class", "text-danger");
            $description.text("🌓✨ “Alas, the shifting sands of fate have turned against you. Twilight slips through your grasp.” 🌓✨");
            $description.attr("class", "text-danger");
          } else {
            $text.text("Your opponent got 30 coins first. You lost.");
            $text.attr("class", "text-danger");
            $description.text("🌓✨ “Your rival, swift as a shadow, claims the final coin. The Twin Monarchs weep for your loss.” 🌓✨");
            $description.attr("class", "text-danger");
          }
        }
      } else {
        if (score.score2 > score.score1) {
            if(!playerCheatRecord[2]){
              if (score.score2 < 30) {
                $text.text("Time's up! You won!");
                $text.attr("class", "text-success");
                $description.text("🌓✨ “As the last rays of twilight fade, you emerge victorious!” 🌓✨");
                $description.attr("class", "text-success");
              } else {
                $text.text("You got 30 coins! You won!");
                $text.attr("class", "text-success");
                $description.text("🌓✨ “With 30 coins in hand, you transcend mortal boundaries and become the true Twilight Champion!” 🌓✨");
                $description.attr("class", "text-success");
              }
          }else{
            $text.text("You Won ?");
            $text.attr("class", "text-danger");
            $description.text("“By some twist of fate, you emerge triumphant. But is it skill or sorcery that guides your hand? The Twin Monarchs raise an eyebrow, questioning your path to victory.” ❓🌓✨");
            $description.attr("class", "text-danger");
          }
        } else {
          if (score.score1 < 30) {
            $text.text("Time's up! You lost.");
            $text.attr("class", "text-danger");
            $description.text("🌓✨ “Alas, the shifting sands of fate have turned against you. Twilight slips through your grasp.” 🌓✨");
            $description.attr("class", "text-danger");
          } else {
            $text.text("Your opponent got 30 coins first. You lost.");
            $text.attr("class", "text-danger");
            $description.text("🌓✨ “Your rival, swift as a shadow, claims the final coin. The Twin Monarchs weep for your loss.” 🌓✨");
            $description.attr("class", "text-danger");
          }
        }
      }

      $("#game-over-overlay").show();
    });
  };

  const disconnect = function () {
    socket.disconnect();
    socket = null;
  };

  const signOut = function () {
    socket.emit("sign out");
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

  const getRooms = function () {
    socket.emit("get game rooms");
  };

  const getGameConfig = function () {
    socket.emit("get game config");
  };

  const startGame = function (room) {
    message = { room };
    socket.emit("click start game", JSON.stringify(message));
  };

  const getCoin = function (gameroom, player) {
    message = { gameroom, player };
    socket.emit("get coin", JSON.stringify(message));
  };

  const playerMovement = function (room, player, command, parameters) {
    if (getSocket() && room && player) {
      message = { room, player, command, parameters };
      socket.emit("game command", JSON.stringify(message));
    } else {
      console.log("Socket not initialized");
    }
  };

  const playerCheat= function (room, player) {
    message = { room, player };
    socket.emit("player cheat", JSON.stringify(message));
  };

  const playerKeys = function (room, player, keyCode, event) {
    message = { room, player, keyCode, event };
    socket.emit("game keys", JSON.stringify(message));
  };
  const playerCollectedCoin = function (room, player) {
    message = { room, player };
    socket.emit("coin collected", JSON.stringify(message));
  };
  const playerTeleported = function (room, player, teleporterSteppedOn) {
    message = { room, player, teleporterSteppedOn };
    socket.emit("player teleport", JSON.stringify(message));
  };
  const playerTrapped = function (room, player) {
    message = { room, player };
    socket.emit("player trap", JSON.stringify(message));
  };
  const playerAttack = function (room, player, direction) {
    message = { room, player, direction };
    socket.emit("player attack", JSON.stringify(message));
  };
  const quitGame = function (room, player) {
    message = { room, player };
    socket.emit("quit game", JSON.stringify(message));
  };
  const hitOpponent = function (room, player, opponent) {
    message = { room, player, opponent }
    socket.emit("player hit", JSON.stringify(message));
  }
  const checkGameEnd = function (room, player) {
    message = { room, player}
    socket.emit("check gameend", JSON.stringify(message));
  }

  return {
    getSocket,
    connect,
    disconnect,
    joinRoom,
    getRooms,
    getGameConfig,
    getCoin,
    startGame,
    playerMovement,
    playerKeys,
    playerCollectedCoin,
    playerTeleported,
    playerTrapped,
    playerAttack,
    quitGame,
    signOut,
    hitOpponent,
    playerCheat,
    checkGameEnd
  };
})();
