function handleKeydown(
  event,
  playerInstance,
  roomNum,
  playerSlot,
  initComplete
) {
  let { isGameEnd } = GameObjectsConfig.getConfig();
  if (isGameEnd) return;
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
  let { isGameEnd } = GameObjectsConfig.getConfig();
  if (isGameEnd) return;
  switch (event.keyCode) {
    case 37: // Left arrow
      playerInstance.stop(1);
      Socket.playerKeys(roomNum, playerSlot, 37, "keyup");
      break;
    case 39: // Right arrow
      playerInstance.stop(2);
      Socket.playerKeys(roomNum, playerSlot, 39, "keyup");
      break;
    case 67: // C for Cheating
      Socket.playerCheat(roomNum, playerSlot)
      //playerInstance.cheatToggle();
      break;
  }
}
