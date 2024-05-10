function handlePlayerMovementSocket(player1, player2, message) {
  const { room, player, keyCode, event } = JSON.parse(message);

  const handlePlayerMovement = (playerInstance) => {
    switch (event) {
      case "keydown":
        switch (keyCode) {
          case 37:
            playerInstance.move(1);
            break;
          case 39:
            playerInstance.move(2);
            break;
          case 38:
            playerInstance.jump();
            playerInstance.setInCollider(false);
            break;
        }
        break;
      case "keyup":
        switch (keyCode) {
          case 37:
            playerInstance.stop(1);
            break;
          case 39:
            playerInstance.stop(2);
            break;
        }
        break;
      case "attackRight":
        playerInstance.stop(2);
        playerInstance.attack("right");
        break;
      case "attackLeft":
        playerInstance.stop(1);
        playerInstance.attack("left");
        break;
    }
  };

  switch (player) {
    case 1:
      handlePlayerMovement(player1);
      break;
    case 2:
      handlePlayerMovement(player2);
      break;
  }
}
