// This function defines the trap module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the trap
// - `y` - The initial y position of the trap
const Trap = function(ctx, x, y) {

    // This is the sprite sequences of the trap
    const sequences = { x: 0, y: 0, width: 32, height: 32, count: 4, timing: 100, loop: true };

    // This is the sprite object of the trap created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the trap sprite here.
    sprite.setSequence(sequences)
          .setScale(2)
          .useSheet("./assets/trap_sprite.png");

    // This is the birth time of the trap for finding its age.
    let birthTime = performance.now();

    // This function gets the age (in millisecond) of the trap.
    // - `now` - The current timestamp
    const getAge = function(now) {
        return now - birthTime;
    };

    // This function randomizes the trap position.
    // - `area` - The area that the trap should be located in.
    const randomize = function(coordinates) {
        birthTime = performance.now();
        const {x, y} = coordinates[Math.floor(Math.random() * coordinates.length)];
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
        update: sprite.update
    };
};
