const GameRooms = (function () {
  let roomJoint = null;
  let slotJoint = null;

  const initialize = function () {
    $("#instruction-overlay").hide();

    $("#close-instruction-button").click(function () {
      $("#instruction-overlay").hide();
    });

    $("#instruction-button").click(function () {
      $("#instruction-overlay").show();
    });

    $("#game-room-list").on("click", ".join-button", function () {
      var $gameRoom = $(this).closest(".game-room-container");
      var roomId = $gameRoom.data("room");
      var $playerSlot = $(this).closest(".player-container");
      var playerNumber = $playerSlot.index() + 1;

      console.log("Joining Room " + roomId + " - Player " + playerNumber);

      roomJoint = roomId;
      slotJoint = playerNumber;

      Socket.joinRoom(roomJoint, slotJoint, Authentication.getUser().username);
    });
  };

  // expected input { "player321" : {username : "player321"} , "player123" : {username : "player123"} ... }
  const updateOnlinePlayers = function (onlinePlayers) {
    //append each online players username to the list
    $("#online-player-list").empty();
    for (const key in onlinePlayers) {
      var username = onlinePlayers[key].username;
      var $li = $("<li>").text(username);
      $("#online-player-list").append($li);
    }
  };

  // expected input { "1" : {player1 : "player321", player2 : "player123"} , "2" :
  // {player1 : "player321", player2 : "player123"} ... }
  const updateGameRooms = function (gameRooms) {
    //update each game room with the players
    for (const key in gameRooms) {
      var $gameRoom = $(`.game-room-container[data-room=${key}]`);

      // this should be 2 buttons, show them both
      $gameRoom.find(`button.join-button`).show();

      var room = gameRooms[key];
      for (const player in room) {
        var username = room[player];
        var playerNumber = player.replace("player", "");
        var $playerSlot = $gameRoom.find(
          `.player-container .player-${playerNumber}-slot`
        );

        $playerSlot.text(username ? username : "Empty Slot");
        // hide button if not empty
        if (username) {
          //hide the join button
          $gameRoom.find(`button.join-button`)[
            parseInt(playerNumber) - 1
          ].style.display = "none";
        }
      }
    }
  };

  return { initialize, updateOnlinePlayers, updateGameRooms };
})();
