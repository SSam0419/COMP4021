// This function defines the Player module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the player
// - `y` - The initial y position of the player

// - `gameArea` - The bounding box of the game area
const Player = function (ctx, x, y, gameArea, playerSlot) {
  let isTrapped = false;
  let isAttacking = false;
  let isAttackCooldown = false;
  let isTakingHit = false;
  let lastUpdate = 0;
  // This is the sprite sequences of the player facing different directions.
  const sequences = {
    idle: {
      x: 640,
      y: 48,
      width: 160,
      height: 63,
      count: 8,
      timing: 100,
      loop: true,
      orientation: "right",
    },
    idleLeft: {
      x: 1920,
      y: 48,
      width: 160,
      height: 63,
      count: 8,
      timing: 100,
      loop: true,
      orientation: "left",
    },
    run: {
      x: 3840,
      y: 48,
      width: 160,
      height: 63,
      count: 8,
      timing: 100,
      loop: true,
      orientation: "right",
    },
    runLeft: {
      x: 5120,
      y: 48,
      width: 160,
      height: 63,
      count: 8,
      timing: 100,
      loop: true,
      orientation: "left",
    },
    jump: {
      x: 3200,
      y: 48,
      width: 160,
      height: 63,
      count: 2,
      timing: 100,
      loop: true,
      orientation: "right",
    },
    jumpLeft: {
      x: 3520,
      y: 48,
      width: 160,
      height: 63,
      count: 2,
      timing: 100,
      loop: true,
      orientation: "left",
    },
    fall: {
      x: 0,
      y: 48,
      width: 160,
      height: 63,
      count: 2,
      timing: 100,
      loop: true,
      orientation: "right",
    },
    fallLeft: {
      x: 320,
      y: 48,
      width: 160,
      height: 63,
      count: 2,
      timing: 100,
      loop: true,
      orientation: "left",
    },
  };
  const attackRightSequences = {
    x: 0,
    y: 48,
    width: 160,
    height: 63,
    count: 4,
    timing: 100,
    loop: false,
  };
  const deathSequences = {
    x: 0,
    y: 48,
    width: 160,
    height: 63,
    count: 6,
    timing: 100,
    loop: false,
  };
  // This is the sprite object of the player created from the Sprite module.
  const sprite = Sprite(ctx, x, y);
  const attackLeftSprite = Sprite(ctx, x, y, true);
  const attackRightSprite = Sprite(ctx, x, y);
  const deathSprite = Sprite(ctx, x, y);
  // The sprite object is configured for the player sprite here.
  let playerSprites = {
    movement: sprite
      .setSequence(sequences.idle)
      .setScale(0.75)
      .useSheet("./assets/player_sprite.png"),
    attackRight: attackRightSprite
      .setSequence(attackRightSequences)
      .setScale(-1, 0.75)
      .useSheet("./assets/Attack1.png"),
    attackLeft: attackLeftSprite
      .setSequence(attackRightSequences)
      .setScale(0.75)
      .useSheet("./assets/Attack1.png"),
    death: deathSprite
      .setSequence(deathSequences)
      .setScale(0.75)
      .useSheet("./assets/Death.png"),
  };

  // This is the moving direction, which can be a number from 0 to 4:
  // - `0` - not moving
  // - `1` - moving to the left
  // - `2` - moving to the right
  // - `3` - jump
  let direction = 0;
  let attackDirection = "";

  // This is the moving speed (pixels per second) of the player
  let speed = 150;

  // JUMP VARIABLES
  let inJump = false;
  let inFall = false;
  let inCollider = true;
  let jumpHeight = 150;
  let jumpingY = 0;

  // TRANSPORT VARIABLES
  let transporting = false;
  let transportX;
  let transportY;
  let transportCooldown = 5000;

  const getInJump = function () {
    return inJump;
  };

  const getInFall = function () {
    return inFall;
  };

  const setInCollider = function (boolean) {
    inCollider = boolean;
    if (!(getInCollider() || getInJump())) {
      fall();
    }
  };

  const getInCollider = function () {
    return inCollider;
  };

  const trap = (x, y) => {
    isTrapped = true;
    playerSprites.movement.setXY(x, y);
  };
  const getIsTrapped = () => {
    return isTrapped;
  };
  const setIsTrapped = (_isTrapped) => {
    isTrapped = _isTrapped;
  };

  const updateSocketPlayerMovement = function (room, slot) {
    //  {room: 1, player: 1 , command: "updatePos/getCoin/teleport/hitTrap", parameters: {x=123,y=456}}

    Socket.playerMovement(room, slot, "updatePos", {
      x: playerSprites.movement.getXY().x,
      y: playerSprites.movement.getXY().y,
    });
    // console.log("Player Movement Updated",playerSprites.movement.getXY());
  };

  // This function sets the player's moving direction.
  // - `dir` - the moving direction (1: Left, 2: Right, 3: Up)
  const move = function (dir) {
    if (isTrapped) return console.log("trapping");
    if (dir >= 1 && dir <= 4 && dir != direction) {
      if (!(getInJump() || getInFall())) {
        switch (dir) {
          case 1:
            playerSprites.movement.setSequence(sequences.runLeft);
            break;
          case 2:
            playerSprites.movement.setSequence(sequences.run);
            break;
        }
      }
      direction = dir;
    }
  };

  // This function stops the player from moving.
  // - `dir` - the moving direction when the player is stopped (1: Left, 2: Right, 3: Up)
  const stop = function (dir) {
    if (direction == dir) {
      if (!(getInJump() || getInFall())) {
        switch (dir) {
          case 1:
            playerSprites.movement.setSequence(sequences.idleLeft);
            break;
          case 2:
            playerSprites.movement.setSequence(sequences.idle);
            break;
        }
      }
      direction = 0;
    }
  };

  const attack = function (orientation) {
    if (orientation === "left") {
      return attackLeft();
    } else if (orientation === "right") {
      return attackRight();
    }
    console.log("Invalid Arguments for attack");
    return { x: 0, y: 0 };
  };

  const attackLeft = function () {
    if (getIsTakingHit()) return console.log("taking hit");
    if (getIsAttackCooldown()) return console.log("attack on cooldown");
    if (getIsTrapped()) return;
    if (getInJump() || getInFall())
      return console.log("cant attack while jumping");
    if (getIsAttacking()) return console.log("cant attack while attacking");
    console.log("attacking left");

    isAttacking = true;
    isAttackCooldown = true;
    attackDirection = "left";

    playerSprites.attackLeft.setSequence(attackRightSequences);
    playerSprites.attackLeft.setXY(
      playerSprites.movement.getXY().x,
      playerSprites.movement.getXY().y - 5
    );
    // hide player sprite
    playerSprites.movement.setXY(-100, -100);

    setTimeout(() => {
      isAttacking = false;
      attackDirection = "";
      playerSprites.movement.setXY(
        playerSprites.attackLeft.getXY().x,
        playerSprites.attackLeft.getXY().y
      );
      playerSprites.movement.setSequence(sequences.idle);
      // remove attack sprite
      playerSprites.attackLeft.setXY(-100, -100);
    }, 700);

    setTimeout(() => {
      isAttackCooldown = false;
    }, 5000);
  };

  const attackRight = function () {
    if (getIsTakingHit()) return console.log("taking hit");
    if (getIsAttackCooldown()) return console.log("attack on cooldown");
    if (getIsTrapped()) return;
    if (getInJump() || getInFall())
      return console.log("cant attack while jumping");
    if (getIsAttacking()) return console.log("cant attack while attacking");
    console.log("attacking right");

    isAttacking = true;
    isAttackCooldown = true;
    attackDirection = "right";

    playerSprites.attackRight.setSequence(attackRightSequences);
    playerSprites.attackRight.setXY(
      playerSprites.movement.getXY().x,
      playerSprites.movement.getXY().y - 5
    );
    // hide player sprite
    playerSprites.movement.setXY(-100, -100);

    setTimeout(() => {
      isAttacking = false;
      attackDirection = "";
      playerSprites.movement.setXY(
        playerSprites.attackRight.getXY().x,
        playerSprites.attackRight.getXY().y
      );
      playerSprites.movement.setSequence(sequences.idle);
      // remove attack sprite
      playerSprites.attackRight.setXY(-100, -100);
    }, 700);

    setTimeout(() => {
      isAttackCooldown = false;
    }, 5000);
  };

  const getAttackPosition = () => {
    if (attackDirection === "left") {
      return playerSprites.attackLeft.getXY();
    } else if (attackDirection === "right") {
      return playerSprites.attackRight.getXY();
    }
    console.log("Invalid Arguments for attack");
    return { x: 0, y: 0 };
  };

  const getIsAttacking = () => {
    return isAttacking;
  };
  const getIsAttackCooldown = () => {
    return isAttackCooldown;
  };

  const getIsTakingHit = () => {
    return isTakingHit;
  };

  const takeHit = function () {
    if (getIsTakingHit()) return console.log("already taking hit");
    if (getIsTrapped()) return;
    console.log("taking hit!");
    isTakingHit = true;

    playerSprites.death.setSequence(deathSequences);
    playerSprites.death.setXY(
      playerSprites.movement.getXY().x,
      playerSprites.movement.getXY().y - 5
    );
    // hide player sprite
    playerSprites.movement.setXY(-100, -100);
    setTimeout(() => {
      isTakingHit = false;
      playerSprites.movement.setXY(
        playerSprites.death.getXY().x,
        playerSprites.death.getXY().y
      );
      playerSprites.movement.setSequence(sequences.idle);
      // remove attack sprite
      playerSprites.death.setXY(-1000, -1000);
    }, 3000);
  };

  // JUMP FUNCTIONS
  const jump = function () {
    if (isTrapped) return console.log("trapping");
    if (!(getInJump() || getInFall())) {
      inJump = true;
      jumpingY = playerSprites.movement.getXY().y;
      if (sprite.getOrientation() == "left") {
        playerSprites.movement.setSequence(sequences.jumpLeft);
      } else {
        playerSprites.movement.setSequence(sequences.jump);
      }
    }
  };

  const fall = function () {
    inJump = false;
    inFall = true;
    if (sprite.getOrientation() == "left") {
      playerSprites.movement.setSequence(sequences.fallLeft);
    } else {
      playerSprites.movement.setSequence(sequences.fall);
    }
  };

  // TRANSPORT FUNCTIONS
  const transport = function (x, y, now) {
    transporting = true;
    transportX = x;
    transportY = y;
  };

  // This function speeds up the player.
  const speedUp = function () {
    speed = 250;
  };

  // This function slows down the player.
  const slowDown = function () {
    speed = 150;
  };

  // This function updates the player depending on his movement.
  // - `time` - The timestamp when this function is called
  const update = function (time) {
    const now = Date.now()
    if(lastUpdate===0) lastUpdate = now;
    const ratio = 1/ (now - lastUpdate);
    lastUpdate = now;

    /* Update the player if the player is moving */
    let { x, y } = playerSprites.movement.getXY();
    if (transporting) {
      x = transportX;
      y = transportY;
      jumpingY = transportY;
      transporting = false;
    }

    if (direction != 0) {
      /* Move the player */
      switch (direction) {
        case 1:
          x -= speed*ratio/10;
          break;
        case 2:
          x += speed*ratio/10;
          break;
      }
    }

    if (getInJump()) {
      inCollider = false;
      y -= 20*ratio;
      if (direction != 0) {
        /* Change sprite mid-air */
        switch (direction) {
          case 1:
            playerSprites.movement.setSequence(sequences.jumpLeft);
            break;
          case 2:
            playerSprites.movement.setSequence(sequences.jump);
            break;
        }
      }
      if (jumpingY - y > jumpHeight) {
        fall();
      }
    }

    if (getInFall()) {
      y += 23*ratio;

      if (direction != 0) {
        /* Change sprite mid-air */
        switch (direction) {
          case 1:
            playerSprites.movement.setSequence(sequences.fallLeft);
            break;
          case 2:
            playerSprites.movement.setSequence(sequences.fall);
            break;
        }
      }

      if (getInCollider()) {
        inFall = false;
        if (sprite.getOrientation() == "left") {
          if (direction != 0) {
            playerSprites.movement.setSequence(sequences.runLeft);
          } else {
            playerSprites.movement.setSequence(sequences.idleLeft);
          }
        } else {
          if (direction != 0) {
            playerSprites.movement.setSequence(sequences.run);
          } else {
            playerSprites.movement.setSequence(sequences.idle);
          }
        }
      }
    }

    if (gameArea.isPointInBox(x, y)) playerSprites.movement.setXY(x, y);
    /* Update the sprite object */
    playerSprites.movement.update(time);
  };

  const udpateAttackRight = function (time) {
    playerSprites.attackRight.update(time);
  };
  const udpateAttackLeft = function (time) {
    playerSprites.attackLeft.update(time);
  };
  const updateTakeHit = function (time) {
    playerSprites.death.update(time);
  };

  const getAttackDirection = function (){
    return attackDirection
  }

  const draw = function () {
    if (isAttacking) {
      if (attackDirection === "left") {
        return playerSprites.attackLeft.draw();
      } else {
        return playerSprites.attackRight.draw();
      }
    }
    if (isTakingHit) {
      return playerSprites.death.draw();
    }
    return playerSprites.movement.draw();
  };

  const getPlayerSlot = () => {
    return playerSlot;
  };

  // The methods are returned as an object here.
  return {
    getXY: playerSprites.movement.getXY,
    setXY: playerSprites.movement.setXY,
    move: move,
    stop: stop,
    jump: jump,
    fall: fall,
    transport: transport,
    getInJump: getInJump,
    getInFall: getInFall,
    setInCollider: setInCollider,
    getInCollider: getInCollider,
    speedUp: speedUp,
    slowDown: slowDown,
    getBoundingBox: playerSprites.movement.getBoundingBox,
    draw: draw,
    updateSocketPlayerMovement: updateSocketPlayerMovement,
    update: update,
    udpateAttackRight,
    udpateAttackLeft,
    updateTakeHit,
    trap,
    setIsTrapped,
    getIsTrapped,
    attack: attack,
    getIsAttacking: getIsAttacking,
    getIsAttackCooldown: getIsAttackCooldown,
    getAttackPosition,
    getIsAttacking: getIsAttacking,
    takeHit,
    getIsTakingHit,
    getPlayerSlot,
    getAttackDirection
  };
};
