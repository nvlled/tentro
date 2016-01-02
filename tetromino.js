
// I only used this for random generation of new tetrominos.
// Err... Actually, I could've have just enumerated the keys
// of the permutatorMap.
var typeNames = ["t", "j", "i", "o", "s", "z"];

// Not exactly the best (and correct) implementation,
// but at least I tried some different approach.
var permutatorMap = {

    // Basically, tetromimos are represented
    // only using a single position (x, y)
    // and the list of list of functions
    // for computing its block coordinates. 
    // The single position acts as the pivot.
    //
    // By doing this, rotating and moving 
    // the tetromino is quite efficient.
    
    // Sample tetromino:
    c: [
    //             * <---(above)
    // (center)--> ** <---(left)
        [center, above, left],

    // (center)--> ** <---(left)
    //             * <---(below)
        [center, left, below],
    ],
    

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
    l: [
        [center, left, right, aboveRight],
        [center, above, below, belowLeft],
        [center, left, right, belowLeft],
        [center, below, above, aboveLeft],
    ],

    //
    // ****
    //
    i: [
        [center, left, right, twice(right)],
        [center, above, below, twice(below)],
    ],


    // **
    // **
    o: [[center, right, below, belowRight]],

    // **
    //  **
    z: [
        [center, left, below, belowRight],
        [center, above, left, belowLeft],
    ],

    //  **
    // ** 
    s: [
        [center, right, below, belowLeft],
        [center, above, right, belowRight],
    ],
}

var colors = {
    t: "green",
    l: "blue",
    j: "yellow",
    o: "cyan",
    i: "red",
    z: "orange",
    s: "purple",
}

function Tetro(type, pos, transformer) {
    this.type = type;
    this.color = colors[type];
    this.pos = pos || {x: 0, y: 0};

    var permutators = permutatorMap[type];
    this.transformer = transformer ||
        new Transformer(permutators);
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
        var rotated = this.transformer.rotate();
        return new Tetro(this.type, this.pos, rotated);
    },

    move: function(dx, dy) {
        var pos = addPos(this.pos, dx, dy);
        return new Tetro(this.type, pos, this.transformer);
    },

    moveLeft: function() {
        return this.move(-1, 0);
    },
    moveRight: function() {
        return this.move( 1, 0);
    },

    getBlocks: function() {
        return this.transformer.getCoordinates(this.pos);
    }
}

// TODO: Rename permutator to something more apt
function Transformer(permutators, index) {
    this.index = index || 0;
    this.permutators = permutators || 
        [[center, center, center, center]];
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

// Returns a function that is a
// composition of the given two functions.
function comp(f, g) {
    return function(x) {
        return f(g(x));
    }
}

// Returns a new function that applies the
// given function twice on the argument.
function twice(f) {
    return comp(f, f);
}

function addPos(pos, dx, dy) {
    return {
        x: pos.x + dx,
        y: pos.y + dy
    }
}

//
// Positional functions for computing
// a new position relative to the given position
// 

function center(pos) {
    return pos;
}

function left(pos) {
    return addPos(pos, -1, 0);
}

function below(pos) {
    return addPos(pos, 0, 1);
}

function right(pos) {
    return addPos(pos, 1, 0);
}

function above(pos) {
    return addPos(pos, 0, -1);
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


