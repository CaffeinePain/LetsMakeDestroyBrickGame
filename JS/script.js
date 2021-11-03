//DOM
const wrapper = document.querySelector('#wrapper');
const timer = document.querySelector('#timer');
const score = document.querySelector('#score');
const playground = document.querySelector('#playground');
const ball = document.getElementById('ball');
const arrow = document.getElementById('arrow');

//setting
let timerNum = 0;
let scoreNum = 0;

const ballWidth = 25;
const ballHeight = 25;
let ballX = 0;
let ballY = 25;
let vx = 5;
let vy = 5;
let arrowAngle = 0;
let vd = 1;

const brickWidth = 50;
const brickHeight = 30;

//function
function timerFn() {
    timerNum++;
    timer.innerText = `게임 시작 후 ${timerNum}초`
}

function frame() {

    //공 이동부분
    ballMoveHorizon(vx);
    ballMoveVertical(vy);

    //공 충돌체크
    bounceWindow();
    bounceBrick();
    if(ballY <= 25) {
        window.cancelAnimationFrame(frame);
        brickLineDown();
        CreateBrickLine();
        seizeBall();
        setArrow();
        window.requestAnimationFrame(rotateArrow);
        playground.addEventListener("click", shootBall);
        arrow.classList.remove("hidden");
    } else {
        window.requestAnimationFrame(frame);
    }
}

function shootBall() {


    playground.removeEventListener("click", shootBall);
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
    if(ballY >= 600) {
        reverseBallVy();
    }
}

function setArrow() {
    arrow.style.transform = `rotate(0deg)`;
    arrow.style.left = `${ballX + (ballWidth)/2}px`;
}

function rotateArrow() {
    if(vd === -1) {
        arrowAngle++;
    } else if(vd === 1) {
        arrowAngle--;
    }
    if(arrowAngle === -180) {
        vd = -1;
    } else if(arrowAngle === 0) {
        vd = 1;
    }
arrow.style.transform = `rotate(${arrowAngle}deg)`;

    window.requestAnimationFrame(rotateArrow);
}

function seizeBall() {
    vx = 0;
    vy = 0;
}

function bounceBrick() {
    bricks = document.querySelectorAll(".brick");
    for(i=0; i<bricks.length; i++) {
        e = bricks[i];
        const minX = parsePxToInt(e.style.left);
        const minY = parsePxToInt(e.style.top);
        const maxX = minX + brickWidth;
        const maxY = minY + brickHeight;
        let value = "";
        
        if((minX <= ballX && ballX <= maxX) && (minY <= (600 - ballY) && (600 - ballY) <= maxY)) {
            if(maxX - ballX < maxY - (600 - ballY)) {
                //console.log("Right-Bottom-x");
                value = "Right-Bottom-x";
                reverseBallVx();
                brickNumDown(e);
            }
            if(maxX - ballX > maxY - (600 - ballY)) {
                //console.log("Right-Bottom-y");
                value = "Right-Bottom-y";
                reverseBallVy();
                brickNumDown(e);
            }
        }else if((minX <= ballX + ballWidth && ballX + ballWidth <= maxX) && (minY <= (600 - ballY) && (600 - ballY) <= maxY)) {
            if(maxX - ballX + ballWidth < maxY - (600 - ballY)) {
                //console.log("Left-Bottom-x");
                value = "Left-Bottom-x";
                reverseBallVx();
                brickNumDown(e);
            }
            if(maxX - ballX + ballWidth > maxY - (600 - ballY)) {
                //console.log("Left-Bottom-y");
                value = "Left-Bottom-y";
                reverseBallVy();
                brickNumDown(e);
            }
        } else if((minX <= ballX + ballWidth && ballX + ballWidth <= maxX) && (minY <= (600 - ballY) + ballHeight && (600 - ballY) + ballHeight <= maxY)) {
            if(maxX - ballX + ballWidth < maxY - (600 - ballY)) {
                //console.log("Left-Top-x");
                value = "Left-Top-x";
                reverseBallVx();
                brickNumDown(e);
            }
            if(maxX - ballX + ballWidth > maxY - (600 - ballY)) {
                //console.log("Left-Top-y");
                value = "Left-Top-y";
                reverseBallVy();
                brickNumDown(e);
            }
        } else if((minX <= ballX && ballX <= maxX) && (minY <= (600 - ballY) + ballHeight && (600 - ballY) + ballHeight <= maxY)) {
            if(maxX - ballX + ballWidth < maxY - (600 - ballY)) {
                //console.log("Right-Top-y");
                value = "Right-Top-y";
                reverseBallVx();
                brickNumDown(e);
            }
            if(maxX - ballX + ballWidth > maxY - (600 - ballY)) {
                //console.log("Right-Top-y");
                value = "Right-Top-y";
                reverseBallVy();
                brickNumDown(e);
            }
        }
        if(value !== "") {
            break;
        }
    }
}

function brickNumDown(e) {
    e.counter--;
    e.innerText = `${e.counter}`;
    checkBrickNum(e);
}

function checkBrickNum(e) {
    const counter = e.counter;
    if(counter <= 0) {
        e.remove();
        upScore();
    } else if(counter <= 9) {
        e.style.backgroundColor = "rgb(255, 182, 193)";
        e.style.color = "black";
    } else if(counter <= 19) {
        e.style.backgroundColor = "rgb(215, 142, 153)";
        e.style.color = "black";
    } else if(counter <= 29) {
        e.style.backgroundColor = "rgb(175, 102, 113)";
        e.style.color = "black";
    } else if(counter <= 39) {
        e.style.backgroundColor = "rgb(135, 62, 73)";
        e.style.color = "white";
    } else if(counter <= 49) {
        e.style.backgroundColor = "rgb(95, 22, 33)";
        e.style.color = "white";
    } else {
        e.style.backgroundColor = "rgb(55, 0, 0)";
        e.style.color = "white";
    }
}

function upScore() {
    scoreNum += 100;
    score.innerText = `${scoreNum}점`;
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
setInterval(timerFn, 1000);
window.requestAnimationFrame(frame);
CreateBrickLine();