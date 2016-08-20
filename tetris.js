
window.onload = load;

// The world contains all the colored blocks
// that is not moving
var world = [],
    worldW = 17, // width of the world
    worldH = 21,// height of the world

    // for rendering purposes only
    spacing = 2, // pixels
    blockSize = 20, // pixels

    canvas,
    context;

var level = 0;
var clearedRows = 0;
var isGameOver = false;
var restartGame = false;

var levels = [
    { speed: 50, bgcolor: "#111" },
    { speed: 45, bgcolor: "#121" },
    { speed: 40, bgcolor: "#122" },
    { speed: 35, bgcolor: "#211" },
    { speed: 30, bgcolor: "#313" },
    { speed: 25, bgcolor: "#311" },
    { speed: 20, bgcolor: "#113" },
    { speed: 15, bgcolor: "#333" },
    { speed: 10, bgcolor: "#511" },
    { speed:  5, bgcolor: "#551" },
]

var activePiece = null, // the piece that the player control
    otherPieces = [], // pieces that are released but has still not landed yet
    rotatePiece = false,
    xMovement = 0, // the x-direction of the activePiece
    yMovement = -1;// the y-direction of the activePiece


function load() {
    initCanvas();
    initWorld();
    handleKeyboard();
    handleButtons();

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

    for (var y = 0; y < 2; y++) {
        for (var x = 0; x < worldW; x+=2) {
            var name = randomTypeName();
            var t = new Tetro(name, {x: x, y: y});
            addToWorld(t);
        }
    }
    isGameOver = false;
    restartGame = false;
    level = 0;
    clearedRows = 0;
    newActivePiece();
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

    requestAnimationFrame(gameLoop);
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

function shiftBlocks(row, n) {
    head = world.splice(0, row - n + 1);
    for (var i = 0;i < n; i++) {
        var row = world.shift();
        world.push(row);
    }
    world.unshift.apply(world, head);
}

// Assigns a new tetromino to the active
// piece with the same x-coordinate as the last one.
function newActivePiece() {
    var y = worldH - 3,
        x = activePiece
        ? activePiece.pos.x
        : parseInt(worldW / 2);

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
    requestAnimationFrame(gameLoop);
}

function update(frame) {
    if (restartGame) {
        initWorld();
        return;
    }
    if (isGameOver)
       return;

    // TODO: Piece over-rotates upon keypress
    if (frame % 4 == 0) {
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
            var nrows = clearAndShiftBlocks(piece);
            clearedRows += nrows;
            return null;
        }
    }).filter(function(piece) { return !!piece; });

    if (nextLevel()) {
        level++;
        clearedRows = 0;
    }

    ascend(activePiece);
}

function nextLevel() {
    return clearedRows >= 5;
}

// Moves the active piece one row higher.
// It adds the active piece to the world
// and assigns a new one. Ends the game if
// the world blocks reaches spawn point.
function ascend() {
    //if ((frame % (baseSpeed - ySpeed)) == 0) {
    if ((frame % levels[level].speed) == 0) {
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
    var n = 0;
    if (row >= 0) {
        n = clearBlocks(row);
        shiftBlocks(row, n);
    }
    return n;
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
    isGameOver = true;
    //initWorld();
}

function draw() {
    clearScreen();
    drawWorld();
    otherPieces.forEach(function(piece) {
        piece.draw(context, drawBlock);
    });

    if (activePiece) {
        activePiece.draw(context, drawBlock);
    }

    context.fillStyle = "white";
    var x = 10;
    var y = (worldH) * (spacing + blockSize);
    if (isGameOver)
        context.fillText("game over <press any key>", x, y);
    else
        context.fillText("level " + (level+1), x, y);
}

function clearScreen() {
    context.fillStyle = levels[level].bgcolor;
    context.fillRect(0, 0, canvas.width, canvas.height);
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
        if (world[block.y])
            world[block.y][block.x] = piece.color;
    });
}

// Creates a random tetromino among the available types
function generateTetro(pos) {
    var index = parseInt(Math.random() * typeNames.length),
        type = typeNames[index];

    return new Tetro(type, pos);
}

function handleKeyboard() {
    window.onkeydown = function(e) {
        if (isGameOver) {
            restartGame = true;
        }

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

function handleButtons() {
    var sel = function(q) {
        return document.querySelector(q);
    }
    sel(".up").onclick = function() {
        otherPieces.push(activePiece);
        newActivePiece();
    }
    sel(".down").onclick = function() {
        rotatePiece = true;
        setTimeout(function() { rotatePiece = false }, 60);
    }
    sel(".left").onclick = function() {
        xMovement = -1;
        setTimeout(function() { xMovement = 0}, 60);
    }
    sel(".right").onclick = function() {
        xMovement = 1;
        setTimeout(function() { xMovement = 0}, 60);
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


