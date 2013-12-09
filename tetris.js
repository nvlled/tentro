
window.onload = load;

// The world contains all the colored blocks
// that is not moving
var world = [],
    worldW = 17, // width of the world
    worldH = 21,// height of the world

    // for rendering purposes only
    spacing = 3, // pixels
    blockSize = 20, // pixels
    
    canvas,
    context;

var level = 0,
    ySpeed = 1, // frames
    baseSpeed = 30; // frames

var sampleBlocks = [
    new Tetro("t", {x: 4, y: 4}),
    new Tetro("j", {x: 4, y: 10}),
    new Tetro("l", {x: 4, y: 15}),
    new Tetro("i", {x: 9, y: 3}),
    new Tetro("z", {x: 9, y: 9}),
    new Tetro("s", {x: 9, y: 14}),
];

var activePiece = null, // the piece that the player control
    otherPieces = [], // pieces that are released but has still not landed yet
    rotatePiece = false,
    xMovement = 0, // the x-direction of the activePiece
    yMovement = -1;// the y-direction of the activePiece


function load() {
    initCanvas();
    initWorld();
    handleKeyboard();

    start();
}

function initCanvas() {
    canvas = document.getElementsByTagName("canvas")[0];
    context = canvas.getContext("2d");

    canvas.width = worldW * (blockSize + spacing) + spacing;
    canvas.height = worldH * (blockSize + spacing) + spacing;
}

function initWorld() {
    world = [];

    for (var y = 0; y < worldH; y++) {
        world[y] = new Array(worldW);
    }

    addToWorld(new Tetro("i", {x: 1, y: 0}));
    addToWorld(new Tetro("i", {x: 5, y: 0}));
    addToWorld(new Tetro("i", {x: 9, y: 0}));
    addToWorld(new Tetro("i", {x: 13, y: 0}));
    addToWorld(new Tetro("i", {x: 1, y: 1}));
    addToWorld(new Tetro("i", {x: 5, y: 1}));
    addToWorld(new Tetro("i", {x: 9, y: 1}));
    addToWorld(new Tetro("i", {x: 13, y: 1}));
}

function drawWorld() {
    for (var y = 0; y < worldH; y++) {
        for (var x = 0; x < worldW; x++) {
            var color = world[y][x];
            if (color) {
                drawBlock(context, {x: x, y: y}, color);
            }
        }
    }
}

function start() {
    newActivePiece();
    activePiece.color = "white";

    mozRequestAnimationFrame(gameLoop);
}


function clearBlocks(startRow) {
    var row = startRow;
    while (row >= 0 && isRowCompelete(row)) {
        clearRow(row);
        row--;
    }
    return startRow - row;
}

function clearRow(row) {
    for (var i = 0;i < worldW; i++) {
        world[row][i] = null;
    }
}

function isRowCompelete(row) {
    for (var x = 0;x < worldW; x++) {
        if ( ! world[row][x]) {
            return false;
        }
    }
    return true;
}

function shiftBlocks(n) {
    for (var i = 0;i < n; i++) {
        var row = world.shift();
        world.push(row);
    }
}

// Assigns a new tetromino to the active
// piece with the same x-coordinate as the last one.
function newActivePiece() {
    var y = worldH - 3,
        x = activePiece
        ? activePiece.pos.x
        : Number.toInteger(worldW / 2);

    activePiece = generateTetro({x: x, y: y});
    adjustStartingPosition();
}


// Adjust the activePiece such that it
// is not outside the world boundary.
function adjustStartingPosition() {
    var dx = 1;
    if (activePiece.pos.x >= worldW / 2) {
        dx *= -1;
    }

    while(inBorderCollision(activePiece)) {
        console.log(activePiece.pos.x);
        activePiece = activePiece.move(dx, 0);
    }
}


var frame = 0;
// TODO: Fix frame timing
function gameLoop(t) {
    update(frame);
    draw();

    frame++;
    mozRequestAnimationFrame(gameLoop);
}

function update(frame) {
    // rotate sample blocks

    if (frame % 10 == 0) {
        sampleBlocks = sampleBlocks.map(function(block) {
            return block.rotate();
        });
    }

    // TODO: Piece over-rotates upon keypress
    if (frame % 5 == 0) {
        if (rotatePiece) {
            var rotatedPiece = activePiece.rotate();
            if ( ! inCollision(rotatedPiece)) {
                activePiece = rotatedPiece;
            }
        }

        if (xMovement != 0) {
            var movedPiece = activePiece.move(xMovement, 0);
            if ( ! inCollision(movedPiece)) {
                activePiece = movedPiece;
            }
        }
    }
    
    otherPieces = otherPieces.map(function(piece) {
        var movedPiece = piece.move(0, yMovement);
        if ( ! inCollision(movedPiece)) {
            return movedPiece;
        } else {
            addToWorld(piece);
            clearAndShiftBlocks(piece);
            return null;
        }
    }).filter(function(piece) { return !!piece; });

    ascend(activePiece);
}

// Moves the active piece one row higher.
// It adds the active piece to the world
// and assigns a new one. Ends the game if
// the world blocks reaches spawn point.
function ascend() {
    if ((frame % (baseSpeed - ySpeed)) == 0) {
        var movedPiece = activePiece.move(0, yMovement);
        if ( ! inCollision(movedPiece)) {
            activePiece = movedPiece;
        } else {
            addToWorld(activePiece);
            clearAndShiftBlocks(activePiece);
            newActivePiece();
            if (inCollision(activePiece)) {
                endGame();
            }
        }
    }
}

function clearAndShiftBlocks(piece) {
    var row = highestCompleteRow(piece);
    if (row >= 0) {
        var n = clearBlocks(row);
        shiftBlocks(n);
    }
}

function highestCompleteRow(piece) {
    var blocks = piece.getBlocks(),
        highestRow = -1;
    for (var i = 0;i < blocks.length; i++) {
        var row = blocks[i].y;
        if (isRowCompelete(row) && row > highestRow) {
            highestRow = row;
        }
    }
    return highestRow;
}

// Stub: Just restart the game for the mean time
function endGame() {
    initWorld();
}

function draw() {
    clearScreen();
    drawWorld();
    //renderSampleBlocks();
    otherPieces.forEach(function(piece) {
        piece.draw(context, drawBlock);
    });

    if (activePiece) {
        activePiece.draw(context, drawBlock);
    }
}

function renderSampleBlocks() {
    sampleBlocks.forEach(function(block) {
        block.draw(context, drawBlock);
    });
}

function clearScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBlock(ctx, pos, style) {
    pos = toPixelPos(pos);
    if (style) {
        ctx.fillStyle = style;
    }
    ctx.fillRect(pos.x, pos.y, blockSize, blockSize);
}

function toPixelPos(pos) {
    return {
        x: spacing + (spacing + blockSize) * pos.x,
        y: spacing + (spacing + blockSize) * pos.y,
    }
}


// Adds the blocks of the pieces to the world
function addToWorld(piece) {
    piece.getBlocks().forEach(function(block) {
        world[block.y][block.x] = piece.color;
    });
}

// Creates a random tetromino among the available types
function generateTetro(pos) {
    var index = Number.toInteger(Math.random() * typeNames.length),
        type = typeNames[index];

    return new Tetro(type, pos);
}

function handleKeyboard() {
    window.onkeydown = function(e) {
        console.log("keycode -> " + e.keyCode);

        // horizontal movement
        if (e.keyCode == 72) {
            xMovement = -1;
        } else if (e.keyCode == 76) {
            xMovement =  1;
        }

        if (e.keyCode == 68) {
            otherPieces.push(activePiece);
            newActivePiece();
        }

        if (e.keyCode == 75) {
            rotatePiece = true;
        }
    }
    window.onkeyup = function(e) {
        //console.log("keycode -> " + e.keyCode);
        if (e.keyCode == 72 || e.keyCode == 76) {
            xMovement = 0;
        } else if (e.keyCode == 75) {
            rotatePiece = false;
        } 
    }
}

// Returns true if the piece in collision
// with other blocks or is outside the world boundary
function inCollision(piece) {
    return piece.getBlocks()
        .some(function(block) {
            return outOfBounds(block) ||
                !!world[block.y][block.x];
        });
}

// Returns true if the piece is overlapping the world boundary
function inBorderCollision(piece) {
    return piece.getBlocks().some(outOfBounds);
}


// Returns true if pos is outside the world boundery
function outOfBounds(pos) {
    return pos.x < 0 ||
        pos.x >= worldW ||
        pos.y < 0 ||
        pos.y >= worldH;
}

