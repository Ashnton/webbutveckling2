// Ställer in grundläggande konstanter
const xLimit = 400
const yLimit = 400
const blockSize = 20
var updateTime = 100

// Ställer in globala variabler
var gameLoop;
var direction = "right";
var xSnake = 200;
var ySnake = 200;
var xFood, yFood;
var eaten = true;
var score = 0;

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
    // Säkerställer att ormen inte rör sig utanför ritytan
    if (checkBorderCollision(xSnake, ySnake, xLimit, yLimit, blockSize)) {
        alert('Fuck off');
        pause();
    } else {
        // Rensar skärmen inför nästa uppritning
        clearCanvas(ctx, xLimit, yLimit);


        // Matlogik
        if (eaten) {
            [xFood, yFood] = getRandomCoordinates(xLimit, yLimit, blockSize);
            eaten = false;
            updateTime/=1.1;
            restartGame();
        }
        drawRect(ctx, xFood, yFood, blockSize, blockSize, "#FFBBAA");


        // Logik för att flytta och rita ormen
        [xSnake, ySnake] = moveSnake(direction, xSnake, ySnake, blockSize);
        drawRect(ctx, xSnake, ySnake, blockSize, blockSize, "#FFFFFF");

        // Logik för att detektera om maten äts
        if (checkCollision(xSnake, ySnake, blockSize, blockSize, xFood, yFood, blockSize, blockSize)) {
            eaten = true;
            score++;
        }

        // Ritar upp poängen
        displayScore(score);
    }
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

function checkBorderCollision(x, y, xLimit, yLimit, stepLength) {
    if (x <= 0 - stepLength || y <= 0 - stepLength || x >= xLimit || y >= yLimit) {
        return true;
    } else {
        return false;
    }
}

function checkCollision(x1, y1, width1, height1, x2, y2, width2, height2) {
    // Beräkna koordinaterna för bounding box för båda objekten
    let left1 = x1;
    let right1 = x1 + width1;
    let top1 = y1;
    let bottom1 = y1 + height1;

    let left2 = x2;
    let right2 = x2 + width2;
    let top2 = y2;
    let bottom2 = y2 + height2;

    // Kolla om bounding box för objekt 1 överlappar med bounding box för objekt 2
    if (right1 > left2 && left1 < right2 && bottom1 > top2 && top1 < bottom2) {
        // Kollision har inträffat
        return true;
    } else {
        // Ingen kollision
        return false;
    }
}

function getRandomCoordinates(xLimit, yLimit, blockSize) {
    let x = Math.floor(Math.random() * (xLimit / blockSize)) * blockSize;
    let y = Math.floor(Math.random() * (yLimit / blockSize)) * blockSize;

    return [x, y]
}

function drawRect(ctx, x, y, width, height, color) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
}

function displayScore(score) {
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(score, 50, 50);
}

function clearCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)
}

function start() {
    gameLoop = setInterval(() => {
        runSnake();
    }, updateTime);

    document.getElementById('startGameBtn').innerText = "Pause"
    document.getElementById('startGameBtn').setAttribute('onclick', "pause()")

}

function pause() {
    clearInterval(gameLoop);
    document.getElementById('startGameBtn').innerText = "Start"
    document.getElementById('startGameBtn').setAttribute('onclick', "start()")
}

function restartGame() {
    pause();
    start();
}