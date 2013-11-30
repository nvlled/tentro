

tentro

var UP = "up",
    RIGHT = "right",
    DOWN = "down",
    LEFT = "left";

var directions = [UP, RIGHT, DOWN, LEFT];

// Not exactly the best (and correct) implementation,
// but at least I tried some different approach.
var coordinates = {
    // ***
    //  * 
    t: {
        up: [center, left, above, right],
        right: [center, left, above, below],
        down: [center, left, right, below],
        left: [center, below, above, left],
    },

    // ***
    //   *
    j: {
        up: [center, left, right, aboveLeft],
        right: [center, above, below, aboveRight],
        down: [center, left, right, belowRight],
        left: [center, above, below, belowLeft],
    },

    // ***
    // *
    l: {
        up: [center, left, right, aboveRight],
        right: [center, above, below, belowLeft],
        down: [center, left, right, belowLeft],
        left: [center, below, above, aboveLeft],
    },


    //
    // ****
    //
    i: {
        up: [center, below, above, twice(above)],
        right: [center, left, right, twice(right)],
        down: [center, above, below, twice(below)],
        left: [center, right, left, twice(left)],
    },


    // **
    // **
    o: {
        up: [center, right, below, belowRight],
        right: [center, right, below, belowRight],
        down: [center, right, below, belowRight],
        left: [center, right, below, belowRight],
    }

    // I forgot, there are s and z pieces too.
}

var colors = {
    t: "green",
    l: "blue",
    j: "yellow",
    o: "cyan",
    i: "red",
}

function Tetromino(blockType, direction, pos) {
    this.blockType = blockType;
    this.color = colors[blockType];
    this.direction = direction || UP;
    this.pos = pos || {x: 0, y: 0};
}

Tetromino.prototype = {
}

function getCoordinates(blockType, direction, pos) {
    var functions = coordinates[blockType][direction];
    return functions.map(function(fn) {
        return fn(pos);
    });
}


function comp(f, g) {
    return function(x) {
        return f(g(x));
    }
}

function twice(f) {
    return comp(f, f);
}

function rotate(dir) {
    var i = directions.indexOf(dir);
    return directions[(i+1) % 4];
}

function add(pos, dx, dy) {
    return {
        x: pos.x + dx,
        y: pos.y + dy
    }
}

function center(pos) {
    return pos;
}

function left(pos) {
    return add(pos, -1, 0);
}

function below(pos) {
    return add(pos, 0, 1);
}

function right(pos) {
    return add(pos, 1, 0);
}

function above(pos) {
    return add(pos, 0, -1);
}

function aboveLeft(pos) {
    return above(left(pos));
}

function aboveRight(pos) {
    return above(right(pos));
}

function belowLeft(pos) {
    return below(left(pos));
}

function belowRight(pos) {
    return below(right(pos));
}


