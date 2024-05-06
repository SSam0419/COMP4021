// This function defines the Player module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the player
// - `y` - The initial y position of the player
// - `gameArea` - The bounding box of the game area
const Player = function (ctx, x, y, gameArea) {
  let isTrapped = false;
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

  // This is the sprite object of the player created from the Sprite module.
  const sprite = Sprite(ctx, x, y);

  // The sprite object is configured for the player sprite here.
  let playerSprites = {
    movement: sprite
      .setSequence(sequences.idle)
      .setScale(0.75)
      .useSheet("./assets/player_sprite.png"),
    attack: {},
  };

  // This is the moving direction, which can be a number from 0 to 4:
  // - `0` - not moving
  // - `1` - moving to the left
  // - `2` - moving to the right
  // - `3` - jump
  let direction = 0;

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
    setTimeout(() => {
      isTrapped = false;
    }, 5000);
  };
  const getIsTrapped = () => {
    return isTrapped;
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

  // JUMP FUNCTIONS
  const jump = function () {
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
          x -= speed / 60;
          break;
        case 2:
          x += speed / 60;
          break;
      }
    }

    if (getInJump()) {
      inCollider = false;
      y -= 3;
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
      y += 3;
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
    draw: playerSprites.movement.draw,
    updateSocketPlayerMovement: updateSocketPlayerMovement,
    update: update,
    trap,
    getIsTrapped,
  };
};
