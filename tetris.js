
window.onload = load;

var worldW = 15,
    worldH = 20,

    spacing = 2, // pixels
    blockSize = 20, // pixels
    
    canvas,
    context;

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


function gameLoop() {
    clearScreen();

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


