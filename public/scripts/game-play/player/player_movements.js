const movePlayer = (
  dir,
  direction,
  getInJump,
  getInFall,
  playerSprites,
  sequences,
  setDirection
) => {
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
    setDirection(dir);
  }
};

const stopPlayer = (
  dir,
  direction,
  getInJump,
  getInFall,
  playerSprites,
  sequences,
  setDirection
) => {
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
    setDirection(direction);
  }
};
