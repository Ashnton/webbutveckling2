// Ställer in grundläggande konstanter
const xLimit = 400;
const yLimit = 400;
const blockSize = 20;
var updateTime = 200;

// Ställer in globala variabler
var gameLoop;
var direction = "right";
var xSnakeArray = [200];
var ySnakeArray = [200];
var xObstaclesArray = [];
var yObstaclesArray = [];
var xFood, yFood;
var xFoodArray = [];
var yFoodArray = [];
var foodAmount = 1;
var eaten = false;
var score = 0;
var level;
var removeFoodTimer = 0;
var obstacleAmount = 10;
var setup = true;

// Hanterar val av level
document.querySelectorAll('.level-select-btn').forEach(function (button) {
    button.addEventListener('click', () => {
        level = button.getAttribute('data-level');
    })
})

// Hämtar canvasen och kontexten
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Lyssnar efter tangenttryckningar
document.addEventListener("keydown", (e) => {
    if (e.key == "w") {
        direction = "up";
    } else if (e.key == "a") {
        direction = "left";
    } else if (e.key == "s") {
        direction = "down";
    } else if (e.key == "d") {
        direction = "right";
    }
});

// Spelets huvudloop
function runSnake() {

    // Kontrollerar ifall det är första gången koden körs under omgången
    if (setup) {
        xObstaclesArray = [];
        yObstaclesArray = [];

        xFoodArray = [200];
        yFoodArray = [200];

        if (level == 6) {
            foodAmount = 3;
        } else {
            foodAmount = 1;
        }


        if (level == 2 || level == 4 || level == 5) {
            [xObstaclesArray, yObstaclesArray] = randomObstacles(obstacleAmount, xSnakeArray, ySnakeArray);
        }

        xSnakeArray = [200];
        ySnakeArray = [200];

        setup = false;
    }
    // Säkerställer att ormen inte rör sig utanför ritytan
    if (checkBorderCollision(xSnakeArray[0], ySnakeArray[0], xLimit, yLimit, blockSize) && level != 3) {
        alert('Game over!');
        updateTime = 200;
        score = 0;
        xObstaclesArray, yObstaclesArray = [];
        pause();
    } else { 
        if (xSnakeArray[0] >= xLimit) {
            xSnakeArray[0] = 0;
        } else if (xSnakeArray[0] < 0) {
            xSnakeArray[0] = xLimit;
        }
        if (ySnakeArray[0] >= yLimit) {
            ySnakeArray[0] = 0;
        } else if (ySnakeArray[0] < 0) {
            ySnakeArray[0] = yLimit;
        }
    }
    // Rensar skärmen inför nästa uppritning
    clearCanvas(ctx, xLimit, yLimit);

    if (level == 4) {
        if (removeFoodTimer % 16 == 0)
            [xObstaclesArray, yObstaclesArray] = moveTowardsSnake(xSnakeArray, ySnakeArray, xObstaclesArray, yObstaclesArray, blockSize);
        if (score % 5 === 0 && score !== 0) {
            obstacleAmount += 2
            [xObstaclesArray, yObstaclesArray] = randomObstacles(obstacleAmount, xSnakeArray, ySnakeArray);
        }
    }
    if (level == 5) {
        if (removeFoodTimer % 4 == 0)
            [xObstaclesArray, yObstaclesArray] = moveTowardsSnake(xSnakeArray, ySnakeArray, xObstaclesArray, yObstaclesArray, blockSize);
    }

    // Matlogik
    if (eaten) {
        xFoodArray = [];
        yFoodArray = [];

        foodValid = false;
        while (!foodValid) {
            [xFood, yFood] = getRandomCoordinates(xLimit, yLimit, blockSize);

            for (let i = 0; i < xSnakeArray.length; i++) {
                if (xSnakeArray[i] != xFood && ySnakeArray[i] != yFood && !checkCollisionSnake(xFood, yFood, xObstaclesArray, yObstaclesArray)) {
                    xFoodArray.push(xFood)
                    yFoodArray.push(yFood)

                    if (xFoodArray.length >= foodAmount) {
                        foodValid = true;
                    }
                }
            }
        }
        eaten = false;
        updateTime /= 1.1;
        // Skapa en ny bit av ormen på motsatt riktning av rörelsen
        let newX = xSnakeArray[xSnakeArray.length - 1];
        let newY = ySnakeArray[ySnakeArray.length - 1];
        if (direction === "up") newY += blockSize;
        else if (direction === "down") newY -= blockSize;
        else if (direction === "left") newX += blockSize;
        else if (direction === "right") newX -= blockSize;

        if (level != 6) {
            xSnakeArray.push(newX);
            ySnakeArray.push(newY);
        } else {
            xObstaclesArray.push(xSnakeArray[0]);
            yObstaclesArray.push(ySnakeArray[0]);
        }
    }

    // Ritar in maten på canvasen
    for (let i = 0; i < xFoodArray.length; i++) {
        drawRect(ctx, xFoodArray[i], yFoodArray[i], blockSize, blockSize, "#FFBBAA");
    }

    // Levelspecifikt
    if (level == 9) {
        [xObstaclesArray, yObstaclesArray] = randomObstacles(10, xSnakeArray, ySnakeArray);
    } else if (level == 7 || level == 8) {

        if (removeFoodTimer === 0) {
            xFoodArray = [];
            yFoodArray = [];

            [xFoodArray[0], yFoodArray[0]] = getRandomCoordinates(xLimit, yLimit, blockSize);
            removeFoodTimer = distToSnake(xFoodArray[0], yFoodArray[0], xSnakeArray, ySnakeArray, blockSize);

            // Gör ormen kortare
            if (level == 8) {
                if (xSnakeArray.length > 1) {
                    xSnakeArray.pop();
                    ySnakeArray.pop();

                    if (score > 0) {
                        score--;
                    }
                }
            }

        }
    }

    // Flytta ormens huvud baserat på rörelsedirektionen
    let newXHead = xSnakeArray[0];
    let newYHead = ySnakeArray[0];
    if (direction === "up") newYHead -= blockSize;
    else if (direction === "down") newYHead += blockSize;
    else if (direction === "left") newXHead -= blockSize;
    else if (direction === "right") newXHead += blockSize;

    // Ta bort svansens sista bit
    xSnakeArray.pop();
    ySnakeArray.pop();

    // Lägg till det nya huvudet i ormens position
    xSnakeArray.unshift(newXHead);
    ySnakeArray.unshift(newYHead);

    // Rita ormen
    for (let i = 0; i < xSnakeArray.length; i++) {
        drawRect(ctx, xSnakeArray[i], ySnakeArray[i], blockSize, blockSize, "#FFFFFF");
    }

    // Rita hinder
    for (let i = 0; i < xObstaclesArray.length; i++) {
        drawRect(ctx, xObstaclesArray[i], yObstaclesArray[i], blockSize, blockSize, "#AA44BB");
    }


    // Logik för att detektera om maten äts
    if (checkCollisionArray(xSnakeArray[0], ySnakeArray[0], xFoodArray, yFoodArray)) {
        eaten = true;
        score++;
    }

    // Logik för att detektera om ormen krockar med sig själv
    if (checkCollisionSnake(newXHead, newYHead, xSnakeArray, ySnakeArray)) {
        alert('Game over!');
        xObstaclesArray, yObstaclesArray = [];
        updateTime = 200;
        score = 0
        pause();
    }

    // Logik för att hantera om ormen kolliderar med ett hinder
    if (checkCollisionArray(newXHead, newYHead, xObstaclesArray, yObstaclesArray)) {
        alert('Game over!');
        xObstaclesArray, yObstaclesArray = [];
        updateTime = 200;
        score = 0
        pause();
    }

    // Ritar upp poängen
    displayScore(score);

    // Justera räknare
    removeFoodTimer--;
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

function distToSnake(x_cord, y_cord, snake_x, snake_y, blocksize) {
    return (Math.abs(Number(snake_x[0]) - Number(x_cord)) / blocksize + Math.abs(Number(snake_y[0]) - Number(y_cord)) / blocksize + 20)
}

function moveTowardsSnake(snake_x, snake_y, enemy_x, enemy_y, blocksize) {
    for (let i = 0; i < enemy_x.length; i++) {
        let newX, newY;
        if (enemy_x[i] < snake_x[0]) {
            newX = enemy_x[i] + blocksize;
        }
        if (enemy_y[i] < snake_y[0]) {
            newY = enemy_y[i] + blocksize;
        }
        if (enemy_x[i] > snake_x[0]) {
            newX = enemy_x[i] - blocksize;
        }
        if (enemy_y[i] > snake_y[0]) {
            newY = enemy_y[i] - blocksize;
        }
        if (enemy_x[i] == snake_x[0]) {
            newX = enemy_x[i];
        }
        if (enemy_y[i] == snake_y[0]) {
            newY = enemy_y[i];
        }
        if (!checkCollisionSnake(newX, newY, enemy_x, enemy_y) && !checkCollisionSnake(newX, newY, snake_x, snake_y)) {
            enemy_x[i] = newX;
            enemy_y[i] = newY;
        }
    }
    return [enemy_x, enemy_y]
}

function randomObstacles(amount, snake_x, snake_y) {
    let obstacles_x = [];
    let obstacles_y = [];
    for (let i = 0; i < amount; i++) {
        let invalid_position = true;
        while (invalid_position) {
            let obstacle_temp_x = Math.floor(Math.random() * 20) * 20;
            let obstacle_temp_y = Math.floor(Math.random() * 20) * 20;

            if (!checkCollisionSnake(obstacle_temp_x, obstacle_temp_y, snake_x, snake_y)) {
                obstacles_x.push(obstacle_temp_x);
                obstacles_y.push(obstacle_temp_y);
                invalid_position = false;
            }
        }
    }
    return [obstacles_x, obstacles_y];
}

function checkBorderCollision(x, y, xLimit, yLimit, stepLength) {
    if (x <= 0 - stepLength || y <= 0 - stepLength || x >= xLimit || y >= yLimit) {
        return true;
    } else {
        return false;
    }
}

function checkCollisionSnake(head_x, head_y, snake_x, snake_y) {
    for (let i = 1; i < snake_x.length; i++) {
        if (head_x == snake_x[i] && head_y == snake_y[i]) {
            return true
        }
    }
}

function checkCollisionArray(head_x, head_y, snake_x, snake_y) {
    for (let i = 0; i < snake_x.length; i++) {
        if (head_x == snake_x[i] && head_y == snake_y[i]) {
            return true
        }
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
    setup = true;
    start();
}