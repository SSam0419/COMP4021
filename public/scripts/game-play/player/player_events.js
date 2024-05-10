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

  //handle player attack
  if (player.getIsAttacking()) {
    Sounds.play("attack");

    if (player.getAttackDirection() == "right") {
      if (
        Math.abs(player.getAttackPosition().y - opponentPlayer.getXY().y) <
          15 &&
        // opponent is on the right within 50px
        opponentPlayer.getXY().x - player.getAttackPosition().x <= 60 &&
        opponentPlayer.getXY().x - player.getAttackPosition().x >= 0
      ) {
        if(!opponentPlayer.getIsCheating() && !opponentPlayer.getIsTakingHit()){
          console.log("Running Socket hit opponent")
          Socket.hitOpponent(roomNum, player.getPlayerSlot(), opponentPlayer.getPlayerSlot())
        }
        opponentPlayer.takeHit();
        // Notification(player.getPlayerSlot(), opponentPlayer.getIsCheating()?"hit cheat":"hit");
        Notification(opponentPlayer.getPlayerSlot(), opponentPlayer.getIsCheating()?"get hit cheat":"get hit");
      }
    } else {
      console.log(player.getAttackPosition());
      console.log(opponentPlayer.getXY())
      console.log(player.getAttackPosition().x - opponentPlayer.getXY().x)
      if (
        Math.abs(player.getAttackPosition().y - opponentPlayer.getXY().y) <
          15 &&
        // opponent is on the left within 50px
        player.getAttackPosition().x - opponentPlayer.getXY().x <= 60 &&
        player.getAttackPosition().x - opponentPlayer.getXY().x >= 0
      ) {
        if(!opponentPlayer.getIsCheating() && !opponentPlayer.getIsTakingHit() && player.getPlayerSlot()===playerSlot){
          console.log("Running Socket hit opponent")
          Socket.hitOpponent(roomNum, player.getPlayerSlot(), opponentPlayer.getPlayerSlot())
        }
        opponentPlayer.takeHit();
        // Notification(player.getPlayerSlot(), opponentPlayer.getIsCheating()?"hit cheat":"hit");
        Notification(opponentPlayer.getPlayerSlot(), opponentPlayer.getIsCheating()?"get hit cheat":"get hit");
      }
    }
  }

  //handle coin
  if (coin.getBoundingBox().isPointInBox(player.getXY().x, player.getXY().y)) {
    Sounds.playDirect("coin", 0.8);
    Notification(player.getPlayerSlot(), "coin");
    coin.setXY(-100, -100);
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
    Notification(player.getPlayerSlot(), player.getIsCheating()?"trap cheat":"trap");
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
