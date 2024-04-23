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

      //remove from previous room
      if (roomJoint !== null) {
        var $previousRoom = $(`.game-room-container[data-room=${roomJoint}]`);
        var $previousSlot = $previousRoom.find(
          `.player-container .player-${slotJoint}-slot`
        );
        $previousSlot.text("Empty Slot");
      }

      var playerNumber = $playerSlot.index() + 1;

      $playerSlot
        .find(`p.player-${playerNumber}-slot`)
        .text("User J " + playerNumber);

      console.log("Joining Room " + roomId + " - Player " + playerNumber);
      roomJoint = roomId;
      slotJoint = playerNumber;
    });
  };

  return { initialize };
})();
