// Ställer in grundläggande konstanter
const xLimit = 400
const yLimit = 400
const blockSize = 20
const updateTime = 100

// Ställer in globala variabler
var gameLoop;
var direction;
var xSnake = 200;
var ySnake = 200;

// Hämtar canvasen och kontexten
const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')

// Lyssnar efter tangenttryckningar
document.addEventListener("keydown", (e) => {
    if (e.key == "w") {
        direction = "up"
    } else if (e.key == "a") {
        direction = "left"
    } else if (e.key == "s") {
        direction = "down"
    } else if (e.key == "d") {
        direction = "right"
    }

})

// Spelets huvudloop

function runSnake() {
    [xSnake, ySnake] = moveSnake(direction, xSnake, ySnake, blockSize)
    clearCanvas(ctx, xLimit, yLimit)
    drawRect(ctx, xSnake, ySnake, blockSize, blockSize, "#FFFFFF")
}

function moveSnake(direction, x, y, stepLength) {
    if (direction == "up") {
        y -= stepLength
    } else if (direction == "down") {
        y += stepLength
    } else if (direction == "left") {
        x -= stepLength
    } else if (direction == "right") {
        x += stepLength
    }

    return [x, y]
}

function drawRect(ctx, x, y, width, height, color) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
}

function clearCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)
}

function start() {
    gameLoop = setInterval(() => {
        runSnake();
    }, updateTime);

}
