// This function defines the floor module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the floor
// - `y` - The initial y position of the floor
const Floor = function(ctx, x, y) {

    // This is the sprite sequences of the floor
    const sequences = { x: 0, y: 0, width: 864, height: 10, count: 1, timing: Infinity, loop: false }; // TIMING TO INIFINITY

    // This is the sprite object of the floor created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the floor sprite here.
    sprite.setSequence(sequences)
          .setScale(2)
          .useSheet("./assets/blank.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
};
