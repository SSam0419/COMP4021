function handleKeydown(
  event,
  playerInstance,
  roomNum,
  playerSlot,
  initComplete
) {
  if (!initComplete) return;
  if (playerInstance.getIsAttacking()) return console.log("attacking");
  if (playerInstance.getIsTakingHit())
    return Notification(playerInstance.getPlayerSlot(), "get hit");
  if (playerInstance.getIsTrapped())
    return Notification(playerInstance.getPlayerSlot(), "trap");

  switch (event.keyCode) {
    case 37: // Left arrow
      playerInstance.move(1);
      Socket.playerKeys(roomNum, playerSlot, 37, "keydown");
      break;
    case 39: // Right arrow
      playerInstance.move(2);
      Socket.playerKeys(roomNum, playerSlot, 39, "keydown");
      break;
    case 38: // Up arrow
      playerInstance.jump();
      playerInstance.setInCollider(false);
      Socket.playerKeys(roomNum, playerSlot, 38, "keydown");
      break;
    case 65: // A
      playerInstance.stop(1);
      Socket.playerAttack(roomNum, playerSlot, "left");
      playerInstance.attack("left");
      break;
    case 68: // D
      playerInstance.stop(2);
      Socket.playerAttack(roomNum, playerSlot, "right");
      playerInstance.attack("right");
      break;
  }
}

function handleKeyup(event, roomNum, playerSlot, playerInstance) {
  switch (event.keyCode) {
    case 37: // Left arrow
      playerInstance.stop(1);
      Socket.playerKeys(roomNum, playerSlot, 37, "keyup");
      break;
    case 39: // Right arrow
      playerInstance.stop(2);
      Socket.playerKeys(roomNum, playerSlot, 39, "keyup");
      break;
  }
}
