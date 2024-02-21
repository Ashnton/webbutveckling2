// Ställer in grundläggande konstanter
const xLimit = 400
const yLimit = 400
const blockSize = 20
const updateTime = 50

// Ställer in globala variabler
let direction;
let xSnake = 200;
let ySnake = 200;

// Hämtar canvasen och kontexten
const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')

// Lyssnar efter tangenttryckningar
document.addEventListener("keydown", (e) => {
    console.log(e.key)
    console.log(direction)
    if (e.key == "w") {
        direction = "up"
    } else if (e.key == "a") {
        direction = "left"
    } else if (e.key == "s") {
        direction = "down"
    } else if (e.key == "d") {
        direction = "right"
    }

    [xSnake, ySnake] = moveSnake(direction, xSnake, ySnake, blockSize)
    drawRect(xSnake, ySnake, blockSize, blockSize, "#FFFFFF")
})

// Spelets huvudloop
// setInterval(() => {
//     runSnake()
// }, updateTime);

function runSnake() {

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

function drawRect(x, y, width, height, color) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
}