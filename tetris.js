
window.onload = load;

var worldW = 17,
    worldH = 21,

    spacing = 3, // pixels
    blockSize = 20, // pixels
    
    canvas,
    context;

var world;

var sampleBlocks = [
    new Tetro("t", {x: 4, y: 4}),
    new Tetro("j", {x: 4, y: 10}),
    new Tetro("l", {x: 4, y: 15}),
    new Tetro("i", {x: 9, y: 3}),
    new Tetro("z", {x: 9, y: 9}),
    new Tetro("s", {x: 9, y: 14}),
];

var activePiece = null,
    rotatePiece = false,
    xMovement = 0,
    yMovement = 0;


function load() {
    initCanvas();
    initWorld();

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
    addToWorld(new Tetro("t", {x: 1, y: 1})
            .rotate()
            .rotate());
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
    activePiece = tetroGenerator(
            {x: Number.toInteger(worldW / 2),
             y: worldH - 3});

    activePiece.color = "white";
    mozRequestAnimationFrame(gameLoop);
}


var frame = 0;
function gameLoop() {
    if (frame % 20 == 0) {

        update();
        draw();

    }
    frame++;
    mozRequestAnimationFrame(gameLoop);
}

function update() {
    // rotate sample blocks
    sampleBlocks = sampleBlocks.map(function(block) {
        return block.rotate();
    });

    if (rotatePiece) {
        var rotatedPiece = activePiece.rotate();
        if ( ! inCollision(rotatedPiece)) {
            activePiece = rotatedPiece;
        }
    }

    if (xMovement != 0) {
        var movedPiece = activePiece.move(xMovement, 0);
        activePiece = movedPiece;
    }
}

function draw() {
    clearScreen();
    drawWorld();
    renderSampleBlocks();

    if (activePiece) {
        activePiece.draw(context, drawBlock);
    }
}

function renderSampleBlocks() {
    sampleBlocks.forEach(function(block) {
        block.draw(context, drawBlock);
    });
}

function huh() {
    for (var x = 0; x < 1000; x++) {
        for (var y = 0; y < 1000; y++) {
            if ((x ^ y) % 3 == 0) {
                drawBlock(context, {x: x, y: y} , "white");
            }
            if ((x ^ y) % 5 == 0) {
                drawBlock(context, {x: x, y: y} , "blue");
            }
            if ((x ^ y) % 7 == 0) {
                drawBlock(context, {x: x, y: y} , "orange");
            }
            if ((x ^ y) % 9 == 0) {
                drawBlock(context, {x: x, y: y} , "red");
            }
        }
    }
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

function addToWorld(piece) {
    piece.getBlocks().forEach(function(block) {
        world[block.y][block.x] = piece.color;
    });
}

function tetroGenerator(pos) {
    var index = Number.toInteger(Math.random() * typeNames.length),
        type = typeNames[index];

    return new Tetro(type, pos);
}
