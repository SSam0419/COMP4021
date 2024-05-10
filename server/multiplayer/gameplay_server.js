// This object shares game object amount two players
// UI display will be handle in ui/game-play.js
// All ctx related functions should be handle in ui/game-play.js
// Update of UI will be handle using websocket
// When user input, user should do action corresponds to the correct player through websocket
const GameServer = function () {
  let isGameEnd = false;
  let gameStartTime = 0; // Please DONOT modify the game time!! there is a lot dependencies to it
  let transporterCooldown = 5000; // The cooldown for using the transporter
  let transporterTimeStamp = 0;

  const totalGameTime = 240; // Total game time in seconds
  const coinMaxAge = 10000; // The maximum age of the coins in milliseconds
  const transporterMaxAge = 150000; // The maximum age of the transporter in milliseconds
  const trapMaxAge = 60000;
  const maxScore = 30; // Score to win

  const platformCoordinates = [
    { x: 33, y: 223 },
    { x: 33, y: 103 },
    { x: 178, y: 463 },
    { x: 178, y: 392 },
    { x: 178, y: 295 },
    { x: 178, y: 151 },
    { x: 321, y: 343 },
    { x: 321, y: 223 },
    { x: 321, y: 103 },
    { x: 465, y: 295 },
    { x: 465, y: 151 },
    { x: 682, y: 511 },
    { x: 682, y: 415 },
    { x: 682, y: 321 },
    { x: 682, y: 223 },
    { x: 753, y: 103 },
    { x: 608, y: 103 },
    { x: 58, y: 343 },
  ];

  let objIndexes = { 1: -1, 2: -1 };
  let playerStatus = {
    1: { username: "", score: 0 },
    2: { username: "", score: 0 },
  };
  let playerCheatRecord = { 1: false, 2:false}
  let playerCheating = { 1:false, 2:false}

  // Sharing Coordinates
  let playerCoord = { 1: { x: 215, y: 580 }, 2: { x: 412, y: 580 } };
  let coinCoord = { x: 0, y: 0 };
  let teleporterCoord = { 1: { x: 0, y: 0 }, 2: { x: 0, y: 0 } };
  let trapCoord = { x: 0, y: 0 };

  // Sharing Birthtime
  let coinAge = -1;
  let teleporterAge = { 1: -1, 2: -1 };
  let trapAge = -1;
  let trapTimeout = null;
  let isTrapped = false;
  let sockets = { 1: null, 2: null };

  const setSocket = function (username, socket) {
    for (let i = 1; i <= 2; ++i) {
      if (username === playerStatus[i].username) {
        sockets[i] = socket;
      }
    }
  };

  const reset = function () {
    console.log("reseting game stat");
    isGameEnd = false;
    gameStartTime = 0;
    playerStatus = {
      1: { username: "", score: 0 },
      2: { username: "", score: 0 },
    };
    playerCoord = { 1: { x: 215, y: 580 }, 2: { x: 412, y: 580 } };
    coinCoord = { x: 0, y: 0 };
    teleporterCoord = { 1: { x: 0, y: 0 }, 2: { x: 0, y: 0 } };
    trapCoord = { x: 0, y: 0 };
    coinAge = -1;
    teleporterAge = { 1: -1, 2: -1 };
    trapAge = -1;
    sockets = { 1: null, 2: null };
    playerCheatRecord = { 1: false, 2:false}
    playerCheating = { 1:false, 2:false}
  };

  const deattachSocket = function (slot) {
    sockets[slot] = null;
  };

  // Be called by server socket
  const initialize = function (username1, username2) {
    gameStartTime = 0;
    isGameEnd = false;
    playerStatus = {
      1: { username: username1, score: 0 },
      2: { username: username2, score: 0 },
    };
    playerCheatRecord = { 1: false, 2:false}
    playerCheating = { 1:false, 2:false}
    playerCoord = { 1: { x: 215, y: 580 }, 2: { x: 412, y: 580 } };

    coinCoord = randomCoinPoint();
    teleporterCoord[1] = platformCoordinates[randomPlatformIdx(1)];
    teleporterCoord[2] = platformCoordinates[randomPlatformIdx(2)];
    trapCoord =
      platformCoordinates[
        Math.floor(Math.random() * platformCoordinates.length)
      ];
    coinAge = randomAge(coinMaxAge);
    teleporterAge[1] = randomAge(transporterMaxAge);
    teleporterAge[2] = randomAge(transporterMaxAge);
    trapAge = randomAge(trapMaxAge);
    gameTick();
  };

  const checkGameEnd = function () {
    if (isGameEnd){
      sendEndGame()
    }
  }
  // Natural Update By Time
  const gameTick = function () {
    if (!isGameEnd) {
      gameStartTime += 1
      coinAge += 150;
      teleporterAge[1] += 500;
      teleporterAge[2] += 500;
      trapAge += 1000;

      if (coinAge >= coinMaxAge) {
        coinCoord = randomCoinPoint();
        coinAge = randomAge(coinMaxAge);
      }

      for (let i = 1; i <= 2; ++i) {
        if (teleporterAge[i] >= transporterMaxAge) {
          teleporterCoord[i] = platformCoordinates[randomPlatformIdx(i)];
          teleporterAge[i] = randomAge(transporterMaxAge);
        }
      }

      if (trapAge >= transporterMaxAge) {
        trapCoord =
          platformCoordinates[
            Math.floor(Math.random() * platformCoordinates.length)
          ];
        trapAge = randomAge(trapMaxAge);
      }

      sendGameStat();
    }

    if (gameStartTime >= totalGameTime) {
      finishGame();
      sendEndGame();
      return
    }

    for (let i = 1; i <= 2; ++i) {
      if (playerStatus[i].score >= maxScore) {
        finishGame();
        sendEndGame();
        return 
      }
    }
    // console.log("Ticking")

    setTimeout(() => gameTick(), 1000);
  };

  function sendEndGame() {
    for (let i = 1; i <= 2; ++i) {
      if (sockets[i])
        sockets[i].emit("game end", JSON.stringify(packReturn()));
    }
  }

  const sendGameStat = function() {
    for (let i = 1; i <= 2; ++i) {
      if (sockets[i]) {
        sockets[i].emit("game stat", JSON.stringify(packReturn()));
      }
    }
  }

  const finishGame = () => {
    console.log("game is fininshed")
    isGameEnd = true;
    sendGameStat()
  };

  const packReturn = function () {
    const score = {
      score1: playerStatus[1].score,
      score2: playerStatus[2].score,
    };
    return {
      gameStartTime,
      coinCoord,
      teleporterCoord,
      trapCoord,
      playerCoord,
      score,
      isGameEnd,
      playerCheatRecord,
      playerCheating
    };
  };

  const randomCoinPoint = function () {
    // Settings from original
    const x = 8 + Math.random() * (850 - 8);
    const y = 8 + Math.random() * (580 - 8);
    return { x, y };
  };

  // objIdx: current platform index of corresponding object, teleporter x 2, trap x 1
  const randomPlatformIdx = function (objIdx) {
    newIdx = Math.floor(Math.random() * platformCoordinates.length);
    for (let i = 1; i <= 2; ++i) {
      if (i == objIdx) continue; // Allow Repeat Index for same object
      if (newIdx == objIndexes[i]) return randomPlatformIdx(objIdx); // Prevent Overlapping of different objects
    }
    objIndexes[objIdx] = newIdx;
    return newIdx;
  };

  const randomAge = function (maxAge) {
    return maxAge - (Math.random() * maxAge) / 4;
  };

  const setPlayer = function (username, slot) {
    playerUsername[slot] = username;
  };

  const playerCheat = function (slot) {
    playerCheatRecord[slot] = true;
    playerCheating[slot] = !playerCheating[slot]
    console.log(playerCheating[slot])
  }

  const doCommand = function (command, player, parameters) {
    //{room: 1, player: 1 , command: "updatePos", parameters: {x=123,y=456}}
    switch (command) {
      case "updatePos":
        playerCoord[player] = parameters;
        break;
    }
  };

  const getIsGameEnd = function () {
    return isGameEnd;
  };

  const playerCollectedCoin = function (player) {
    playerStatus[player].score += 1;
    coinCoord = randomCoinPoint();
    coinAge = randomAge(coinMaxAge);
    sendGameStat();
  };

  const playerTeleported = function (player, teleporterSteppedOn) {
    // log event
    console.log(
      "Player " + player + " teleported",
      " stepepd on ",
      teleporterSteppedOn
    );
  };

  const playerTrapped = function (player) {
    if (isTrapped) return;
    // log event
    console.log("Player " + player + " trapped");
    isTrapped = true;
    // reset coord after 3 seconds
    trapAge = 0;
    if (trapTimeout !== null) {
      clearTimeout(trapTimeout);
    }
    trapTimeout = setTimeout(() => {
      trapCoord =
        platformCoordinates[
          Math.floor(Math.random() * platformCoordinates.length)
        ];
      trapAge = randomAge(trapMaxAge);
      isTrapped = false;
    }, 2000);
  };

  // Coin Taking from opponent (Neagtive possible)
  const playerHitOpponent = function (player, opponentPlayer){
    console.log(`${player} Hit Opponent ${opponentPlayer}`)
    playerStatus[player].score += 5;
    playerStatus[opponentPlayer].score -= 5;
    sendGameStat()
  }

  const quitGame = function (player) {
    sockets[player] = null;
    if (sockets[1] == null && sockets[2] == null) {
      reset();
    }
  };

  // The methods are returned as an object here.
  return {
    initialize: initialize,
    setSocket: setSocket,
    doCommand: doCommand,
    setPlayer: setPlayer,
    playerCollectedCoin,
    playerTeleported,
    playerTrapped,
    quitGame,
    deattachSocket,
    getIsGameEnd,
    playerHitOpponent,
    playerCheat,
    sendGameStat,
    checkGameEnd
  };
};

module.exports = GameServer;
