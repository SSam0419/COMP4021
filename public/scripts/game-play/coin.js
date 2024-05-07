// This function defines the coin module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the coin
// - `y` - The initial y position of the coin
const Coin = function (ctx, x, y) {
  // This is the sprite sequences of the coin
  const sequences = {
    x: 0,
    y: 32,
    width: 143,
    height: 135,
    count: 6,
    timing: 200,
    loop: true,
  };

  // This is the sprite object of the coin created from the Sprite module.
  const sprite = Sprite(ctx, x, y);

  // The sprite object is configured for the coin sprite here.
  sprite
    .setSequence(sequences)
    .setScale(0.25)
    .useSheet("./assets/coin_sprite.png");

  // This is the birth time of the coin for finding its age.
  let birthTime = performance.now();

  // This function gets the age (in millisecond) of the coin.
  // - `now` - The current timestamp
  const getAge = function (now) {
    return now - birthTime;
  };

  // This function randomizes the coin position.
  // - `area` - The area that the coin should be located in.
  const randomize = function (area) {
    birthTime = performance.now();
    const { x, y } = area.randomPoint();
    sprite.setXY(x, y);
  };

  // The methods are returned as an object here.
  return {
    getXY: sprite.getXY,
    setXY: sprite.setXY,
    getAge: getAge,
    getBoundingBox: sprite.getBoundingBox,
    randomize: randomize,
    draw: sprite.draw,
    update: sprite.update,
  };
};
