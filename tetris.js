
window.onload = load;

var worldW = 15,
    worldH = 21,

    spacing = 2, // pixels
    blockSize = 20, // pixels
    
    canvas,
    context;

var blocks = [
    new Tetro("t", {x: 4, y: 4}),
    new Tetro("j", {x: 4, y: 10}),
    new Tetro("l", {x: 4, y: 15}),
    new Tetro("i", {x: 9, y: 3}),
    new Tetro("z", {x: 9, y: 9}),
    new Tetro("s", {x: 9, y: 14}),
    new Tetro("o", {x: 6, y: 18}),
]

function load() {
    canvas = document.getElementsByTagName("canvas")[0];
    context = canvas.getContext("2d");

    canvas.width = worldW * (blockSize + spacing) + spacing;
    canvas.height = worldH * (blockSize + spacing) + spacing;

    start();
}

function start() {
    mozRequestAnimationFrame(gameLoop);
}


var frame = 0;
function gameLoop() {
    if (frame % 20 == 0) {
        clearScreen();
        blocks.forEach(function(block) {
            block.draw(context, drawBlock);
            block.rotate();
        });

    }
    frame++;
    mozRequestAnimationFrame(gameLoop);
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



