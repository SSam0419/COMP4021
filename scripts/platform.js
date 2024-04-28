// This function defines the platform module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the platform
// - `y` - The initial y position of the platform
const Platform = function(ctx, x, y) {

    // This is the sprite sequences of the platform
    const sequences = { x: 144, y: 0, width: 80, height: 10, count: 1, timing: Infinity, loop: false };

    // This is the sprite object of the platform created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the platform sprite here.
    sprite.setSequence(sequences)
          .setScale(1)
          .useSheet("./assets/tileset.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
};
