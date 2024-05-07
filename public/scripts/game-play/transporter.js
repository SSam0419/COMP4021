// This function defines the transporter module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the transporter
// - `y` - The initial y position of the transporter
const Transporter = function (ctx, x, y) {
  // This is the sprite sequences of the transporter
  const sequences = {
    x: 0,
    y: 40,
    width: 143,
    height: 144,
    count: 4,
    timing: 500,
    loop: true,
  };

  // This is the sprite object of the transporter created from the Sprite module.
  const sprite = Sprite(ctx, x, y);

  // The sprite object is configured for the transporter sprite here.
  sprite
    .setSequence(sequences)
    .setScale(0.5)
    .useSheet("./assets/transporter_sprite.png");

  // This is the birth time of the transporter for finding its age.
  let birthTime = performance.now();

  // This function gets the age (in millisecond) of the transporter.
  // - `now` - The current timestamp
  const getAge = function (now) {
    return now - birthTime;
  };

  // This function randomizes the transporter position.
  // - `area` - The area that the transporter should be located in.
  const randomize = function (coordinates) {
    birthTime = performance.now();
    const { x, y } =
      coordinates[Math.floor(Math.random() * coordinates.length)];
    sprite.setXY(x, y - 20);
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
