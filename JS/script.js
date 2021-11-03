//DOM
const timer = document.querySelector('#timer');
const playground = document.querySelector('#playground');
const ball = document.getElementById('ball');

//setting
let timerNum = 0;
let timerDisplayNum = 0;

const ballWidth = 25;
const ballHeight = 25;
let ballX = 0;
let ballY = 25;
let vx = 0.1;
let vy = 6;

const brickWidth = 50;
const brickHeight = 30;

//function
function frame() {
    timerNum++;
    if(timerNum % 60 === 0) {
        timerDisplayNum += 1;
    }
    timer.innerText = `게임 시작 후 ${timerDisplayNum}초`;

    //공 이동부분
    ballMoveHorizon(vx);
    ballMoveVertical(vy);

    //공 충돌체크
    bounceWindow();
    bounceBrick();

    //공 충돌부분

    //끝
    window.requestAnimationFrame(frame);
}

function ballMoveHorizon(vx) {
    ballX += vx;
    ball.style.left = `${ballX}px`;
}

function ballMoveVertical(vy) {
    ballY += vy;
    ball.style.top = `${600 - ballY}px`;
}

function reverseBallVx() {
    vx = -vx;
}

function reverseBallVy() {
    vy = -vy;
}

function bounceWindow() {
    /* const ballWidth = parseInt((ball.style.width).replace("px", ""));
    const ballHeight = parseInt((ball.style.height).replace("px", "")); */
    if(ballX <= 0 || ballX+25 >= 300) {
        reverseBallVx();
    }
    if(ballY <= 25 || ballY >= 600) {
        reverseBallVy();
    }
}

function bounceBrick() {
    bricks = document.querySelectorAll(".brick");
    bricks.forEach(e => {
        const minX = parsePxToInt(e.style.left);
        const minY = parsePxToInt(e.style.top);
        const maxX = minX + brickWidth;
        const maxY = minY + brickHeight;
        
        if((minX <= ballX && ballX <= maxX) && (minY <= (600 - ballY) && (600 - ballY) <= maxY)) {
            if(maxX - ballX < maxY - (600 - ballY)) {
                console.log("Right-Bottom-x");
                reverseBallVx();
                return false;
            }
            if(maxX - ballX > maxY - (600 - ballY)) {
                console.log("Right-Bottom-y");
                reverseBallVy();
                return false;
            }
        }else if((minX <= ballX + ballWidth && ballX + ballWidth <= maxX) && (minY <= (600 - ballY) && (600 - ballY) <= maxY)) {
            if(maxX - ballX + ballWidth < maxY - (600 - ballY)) {
                console.log("Left-Bottom-x");
                reverseBallVx();
                return false;
            }
            if(maxX - ballX + ballWidth > maxY - (600 - ballY)) {
                console.log("Left-Bottom-y");
                reverseBallVy();
                return false;
            }
        } else if((minX <= ballX + ballWidth && ballX + ballWidth <= maxX) && (minY <= (600 - ballY) + ballHeight && (600 - ballY) + ballHeight <= maxY)) {
            if(maxX - ballX + ballWidth < maxY - (600 - ballY)) {
                console.log("Left-Top-x");
                reverseBallVx();
                return false;
            }
            if(maxX - ballX + ballWidth > maxY - (600 - ballY)) {
                console.log("Left-Top-y");
                reverseBallVy();
                return false;
            }
        } else if((minX <= ballX && ballX <= maxX) && (minY <= (600 - ballY) + ballHeight && (600 - ballY) + ballHeight <= maxY)) {
            if(maxX - ballX + ballWidth < maxY - (600 - ballY)) {
                console.log("Right-Top-y");
                reverseBallVx();
                return false;
            }
            if(maxX - ballX + ballWidth > maxY - (600 - ballY)) {
                console.log("Right-Top-y");
                reverseBallVy();
                return false;
            }
        }
    });
}

function checkOverlap(i, min, max) {
    
}

function createNewBrick(x, y) {
    brick = document.createElement("span");
    brick.classList.add("brick");
    brick.style.left = `${x}px`;
    brick.style.top = `${y}px`;
    brick.counter = 50;
    brick.innerText = 50;
    playground.append(brick);
}

function CreateBrickLine() {
    for(i=0; i<6; i++) {
        landNum = Math.floor(Math.random() * 10);
        if(landNum < 5) {
            createNewBrick((i*50), 0);
        }
    }
}

function brickLineDown() {
    bricks = document.querySelectorAll(".brick");
    bricks.forEach(e => {
        let topValue = parsePxToInt(e.style.top);
        topValue += 30;
        topValue = parseIntToPx(topValue);
        e.style.top = topValue;
    });
}

function editValueOfPx(px, value) {
    px = parseInt(px.replace("px", "")) + value + "px";
    return px;
}

function parsePxToInt(value) {
    return parseInt(value.replace("px", ""));
}

function parseIntToPx(value) {
    return value + "px";
}

//start
window.requestAnimationFrame(frame);
CreateBrickLine();