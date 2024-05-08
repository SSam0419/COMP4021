function handleGameEvents(
  player,
  opponentPlayer,
  coin,
  trap,
  transporters,
  platforms,
  floor,
  colliders,
  now,
  transporterTimeStamp,
  transporterCooldown,
  setTransporterTimeStamp
) {
  let { isGameEnd } = GameObjectsConfig.getConfig();
  if (isGameEnd) return;
  const { roomNum, playerSlot } = GameroomConfig.getConfig();

  //handle player right attack
  if (player.getIsAttacking()) {
    if (player.getAttackDirection() == "right") {
      if (
        Math.abs(player.getAttackPosition().y - opponentPlayer.getXY().y) <
          15 &&
        // opponent is on the right within 50px
        opponentPlayer.getXY().x - player.getAttackPosition().x < 50 &&
        player.getAttackPosition().x - opponentPlayer.getXY().x < 0
      ) {
        opponentPlayer.takeHit();
        Notification(player.getPlayerSlot(), "hit");
        Notification(player.getPlayerSlot() == 1 ? 2 : 1, "get hit");
      }
    } else {
      if (
        Math.abs(player.getAttackPosition().y - opponentPlayer.getXY().y) <
          15 &&
        // opponent is on the left within 50px
        player.getAttackPosition().x - opponentPlayer.getXY().x < 50 &&
        opponentPlayer.getXY().x - player.getAttackPosition().x < 0
      ) {
        opponentPlayer.takeHit();
        Notification(player.getPlayerSlot(), "hit");
        Notification(player.getPlayerSlot() == 1 ? 2 : 1, "get hit");
      }
    }
  }

  //handle coin
  if (player.getBoundingBox().isPointInBox(coin.getXY().x, coin.getXY().y)) {
    Notification(player.getPlayerSlot(), "coin");
    coin.setXY(-5, -5);
    //only emit when my player collect the coin
    if (player.getPlayerSlot() === playerSlot) {
      Socket.playerCollectedCoin(roomNum, playerSlot);
    }
  }

  //handle trap
  if (
    player.getBoundingBox().isPointInBox(trap.getXY().x, trap.getXY().y - 15) &&
    !player.getInFall() &&
    !player.getInJump()
  ) {
    Notification(player.getPlayerSlot(), "trap");
    let boardId =
      player.getPlayerSlot() === 1 ? "player-1-board" : "player-2-board";

    player.stop(1);
    player.trap(trap.getXY().x, trap.getXY().y - 25);
    // now reset trap position
    Socket.playerTrapped(roomNum, playerSlot);
    return;
  } else {
    // there is no trap near player
    let boardId =
      player.getPlayerSlot() === 1 ? "player-1-board" : "player-2-board";

    player.setIsTrapped(false);
  }

  //handle transporter
  if (!player.getInFall() && !player.getInJump() && !player.getIsTrapped()) {
    for (let i = 1; i <= 2; i++) {
      if (
        player
          .getBoundingBox()
          .isPointInBox(
            transporters[i].getXY().x,
            transporters[i].getXY().y - 30
          )
      ) {
        if (now - transporterTimeStamp < transporterCooldown) {
          Notification(player.getPlayerSlot(), "teleporter cooldown");
        } else {
          console.log("Player is teleported");
          transporterTimeStamp = now;
          setTransporterTimeStamp(transporterTimeStamp);
          const transporter = transporters[i == 1 ? 2 : 1];
          player.transport(
            transporter.getXY().x,
            transporter.getXY().y - 30,
            now
          );
        }

        // const { roomNum, playerSlot } = GameroomConfig.getConfig();
        // Socket.playerTeleported(roomNum, playerSlot, i);
      }
    }
  }

  //others
  for (let i = 0; i < colliders.length - 1; i++) {
    if (
      platforms[i]
        .getBoundingBox()
        .isPointInBox(player.getXY().x, player.getXY().y + 25)
    ) {
      colliders[i] = true;
    } else {
      colliders[i] = false;
    }
  }

  if (
    floor.getBoundingBox().isPointInBox(player.getXY().x, player.getXY().y + 25)
  ) {
    colliders[colliders.length - 1] = true;
  } else {
    colliders[colliders.length - 1] = false;
  }

  if (player.getInFall() || !player.getInJump()) {
    if (colliders.some((value) => value === true)) {
      player.setInCollider(true);
    } else {
      player.setInCollider(false);
    }
  }
}
