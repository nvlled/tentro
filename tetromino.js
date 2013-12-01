
var UP = "up",
    RIGHT = "right",
    DOWN = "down",
    LEFT = "left";

var directions = [UP, RIGHT, DOWN, LEFT];

// Not exactly the best (and correct) implementation,
// but at least I tried some different approach.
var permutatorMap = {
    // ***
    //  * 
    t: [
        [center, left, above, right],
        [center, left, above, below],
        [center, left, right, below],
        [center, below, above, right],
    ],

    // ***
    //   *
    j: [
        [center, left, right, aboveLeft],
        [center, above, below, aboveRight],
        [center, left, right, belowRight],
        [center, above, below, belowLeft],
    ],

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

//function Tetro(blockType, direction, pos) {
function Tetro(type, pos) {
    //this.blockType = blockType;
    this.color = colors[type];
    this.pos = pos || {x: 0, y: 0};

    var permutators = permutatorMap[type];
    this.transformer = new Transformer(permutators);
}

Tetro.prototype = {
    draw: function(ctx, drawFn) {
        var transformer = this.transformer,
            coords = transformer.getCoordinates(this.pos),
            color = this.color;

        coords.forEach(function(pos) {
            drawFn(ctx, pos, color);
        });
    },
    rotate: function() {
        this.transformer = this.transformer.rotate();
    }
}

function Transformer(permutators, index) {
    this.index = index || 0;
    this.permutators = permutators || 
        [center, center, center, center];
}

Transformer.prototype = {
    getCoordinates: function(pos) {
        var index = this.index,
            functions = this.permutators[index];

        // TODO: cache result
        return functions.map(function(fn) {
            return fn(pos);
        });
    },
    rotate: function() {
        var len = this.permutators.length,
            index = this.index;
        return new Transformer(this.permutators, (index + 1) % len); 
    }
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


