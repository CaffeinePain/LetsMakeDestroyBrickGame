//DOM
const wrapper = document.querySelector('#wrapper');
const gameoverScreen = document.querySelector('#gameover-screen');
const overCounter = document.querySelector('#over-counter');
const overScore = document.querySelector('#over-score');
const overTimer = document.querySelector('#over-timer');
const counter = document.querySelector('#counter');
const timer = document.querySelector('#timer');
const score = document.querySelector('#score');
const info = document.querySelector('#info');
const playground = document.querySelector('#playground');
const highlighter = document.querySelector('#highlighter');
const ball = document.querySelector('#ball');
const arrow = document.querySelector('#arrow');
const arrowLeft = document.querySelector('#arrow-point-left');
const arrowRight = document.querySelector('#arrow-point-right');

//user-setting
const ballSpeed = 5; //공 이동속도
const arrowSpeed = 2; //화살표 회전속도

//variables
const ballWidth = 25;
const ballHeight = 25;
const brickWidth = 50;
const brickHeight = 30;

let timerNum = 0;
let scoreNum = 0;
let counterNum = 0;

let frameSwitch = false;
let rotateArrowSwitch = false;

let ballX = 1;
let ballY = ballHeight;
let vx;
let vy;
let vd = -1;

let arrowAngle = 0;

//function
function upCounter() {
    counterNum++;
    counter.innerText = `${counterNum}회 |`;
}

function upScore() {
    scoreNum += 100;
    score.innerText = `${scoreNum}점 |`;
}

function timerFn() {
    timerNum++;
    timer.innerText = `게임 시작 후 ${timerNum}초`;
}

function displayInfo() {
    info.innerText = `ballX : ${ballX.toFixed(3)} / ballY : ${(600 - ballY).toFixed(3)} / ballLeft : ${ball.style.left} / ballTop : ${ball.style.top}`;
}

function onFrame() {
    frameSwitch = true;
    window.requestAnimationFrame(frame);
}

function offFrame() {
    frameSwitch = false;
}

function onRotateArrow() {
    setArrow();
    rotateArrowSwitch = true;
    window.requestAnimationFrame(rotateArrow);
    playground.addEventListener("click", shootBall);
}

function offRotateArrow() {
    rotateArrowSwitch = false;
}

function frame() {
    //console.log("Frame");
    //공 이동부분
    ballMoveHorizon(vx);
    ballMoveVertical(vy);

    //공 충돌체크
    bounceWindow();
    bounceBrick();
    if(frameSwitch) {
        window.requestAnimationFrame(frame);  
    } else if(!frameSwitch) {
        window.cancelAnimationFrame(frame);
    }
}

function shootBall() {
    rotateArrowSwitch = false;
    deg = Math.abs(parseInt(((arrow.style.transform).replace("rotate(", "")).replace("deg)", "")));
    const tan = getArrowTan();
    if(tan > 1) {
        vx = ballSpeed / tan;
        vy = ballSpeed;
    } else if(tan <= 1) {
        vx = ballSpeed;
        vy = vx * tan;
    }
    if(deg > 90) {
        vx = -vx;
    }
    playground.removeEventListener("click", shootBall);
    onFrame();
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
    if(ballX <= 0 || ballX+ballWidth >= 300) {
        reverseBallVx();
    }
    if(ballY >= 600) {
        reverseBallVy();
    }
    if(ballY <= ballHeight) {
        seizeBall();
        offFrame();
        upCounter();
        ballY = ballHeight + 1;
        ball.style.top = `${parseIntToPx(600 - ballY)}`;
        brickLineDown();
        CreateBrickLine();
        setArrow();
        onRotateArrow();
    }
}

function setArrow() {
    arrow.style.transform = `rotate(-15deg)`;
    arrow.style.left = `${ballX + (ballWidth)/2}px`;
    arrow.classList.remove("hidden");
}

function hideGuidance() {
    highlighter.classList.add("hidden");
}

function rotateArrow() {
    //console.log("RotateArrow");
    if(arrowAngle <= -165) {
        vd = 1;
    } else if(arrowAngle >= -15) {
        vd = -1;
    }
    if(vd === 1) {
        arrowAngle += arrowSpeed;
    } else if(vd === -1) {
        arrowAngle -= arrowSpeed;
    }
    arrow.style.transform = `rotate(${arrowAngle}deg)`;
    if(rotateArrowSwitch) {
        window.requestAnimationFrame(rotateArrow);
    } else if(!rotateArrowSwitch) {
        arrow.classList.add("hidden");
        window.cancelAnimationFrame(rotateArrow);
    }
}

function getArrowTan() {
    const Left = arrowLeft.getBoundingClientRect();
    const Right = arrowRight.getBoundingClientRect();
    const LeftX = Left.left;
    const LeftY = Left.top;
    const RightX = Right.left;
    const RightY = Right.top;
    const hValue = Math.abs(RightX - LeftX);
    const vValue = Math.abs(RightY - LeftY);
    return (vValue / hValue).toFixed(3);
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
                console.log("Right-Bottom-x");
                value = "Right-Bottom-x";
                reverseBallVx();
                ballX = maxX + 0.001;
                //console.log(`${ballX}x`);
                ball.style.left = `${ballX}px`;
                brickNumDown(e);
            }
            if(maxX - ballX > maxY - (600 - ballY)) {
                //console.log("Right-Bottom-y");
                value = "Right-Bottom-y";
                reverseBallVy();
                ballY = 600 - maxY - 0.001;
                //console.log(`${ballY}y`);
                ball.style.top = `${600 - ballY}px`;
                brickNumDown(e);
            }
        }else if((minX <= ballX + ballWidth && ballX + ballWidth <= maxX) && (minY <= (600 - ballY) && (600 - ballY) <= maxY)) {
            if(maxX - ballX + ballWidth < maxY - (600 - ballY)) {
                //console.log("Left-Bottom-x");
                value = "Left-Bottom-x";
                reverseBallVx();
                ballX = minX - 0.001 - ballWidth;
                //console.log(`${ballX}x`);
                ball.style.left = `${ballX}px`;
                brickNumDown(e);
            }
            if(maxX - ballX + ballWidth > maxY - (600 - ballY)) {
                //console.log("Left-Bottom-y");
                value = "Left-Bottom-y";
                reverseBallVy();
                ballY = 600 - maxY - 0.001;
                //console.log(`${ballY}y`);
                ball.style.top = `${600 - ballY}px`;
                brickNumDown(e);
            }
        } else if((minX <= ballX + ballWidth && ballX + ballWidth <= maxX) && (minY <= (600 - ballY) + ballHeight && (600 - ballY) + ballHeight <= maxY)) {
            if(maxX - ballX + ballWidth < maxY - (600 - ballY)) {
                //console.log("Left-Top-x");
                value = "Left-Top-x";
                reverseBallVx();
                ballX = minX - 0.001 - ballWidth;
                //console.log(`${ballX}x`);
                ball.style.left = `${ballX}px`;
                brickNumDown(e);
            }
            if(maxX - ballX + ballWidth > maxY - (600 - ballY)) {
                //console.log("Left-Top-y");
                value = "Left-Top-y";
                reverseBallVy();
                ballY = 600 - minY + 0.001 + ballHeight;
                //console.log(`${ballY}y`);
                ball.style.top = `${600 - ballY}px`;
                brickNumDown(e);
            }
        } else if((minX <= ballX && ballX <= maxX) && (minY <= (600 - ballY) + ballHeight && (600 - ballY) + ballHeight <= maxY)) {
            if(maxX - ballX + ballWidth < maxY - (600 - ballY)) {
                //console.log("Right-Top-x");
                value = "Right-Top-x";
                reverseBallVx();
                ballX = maxX + 0.001;
                //console.log(`${ballX}x`);
                ball.style.left = `${ballX}px`;
                brickNumDown(e);
            }
            if(maxX - ballX + ballWidth > maxY - (600 - ballY)) {
                //console.log("Right-Top-y");
                value = "Right-Top-y";
                reverseBallVy();
                ballY = 600 - minY + 0.001 + ballHeight;
                //console.log(`${ballY}y`);
                ball.style.top = `${600 - ballY}px`;
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
    } else {
        setBrickColor(e);
    }
}

function createNewBrick(x, y) {
    brick = document.createElement("span");
    brick.classList.add("brick");
    brick.style.left = `${x}px`;
    brick.style.top = `${y}px`;
    const randMin = (counterNum * 2) + 1;
    const randMax = (counterNum * 2) + 5;
    const randNum = Math.floor(Math.random() * (randMax - randMin + 1)) + randMin;
    brick.counter = randNum;
    brick.innerText = brick.counter;
    setBrickColor(brick);
    playground.append(brick);
}

function setBrickColor(brick) {
    if(brick.counter <= 9) {
        brick.style.backgroundColor = "rgb(255, 182, 193)";
        brick.style.color = "black";
    } else if(brick.counter <= 19) {
        brick.style.backgroundColor = "rgb(215, 142, 153)";
        brick.style.color = "black";
    } else if(brick.counter <= 29) {
        brick.style.backgroundColor = "rgb(175, 102, 113)";
        brick.style.color = "black";
    } else if(brick.counter <= 39) {
        brick.style.backgroundColor = "rgb(135, 62, 73)";
        brick.style.color = "white";
    } else if(brick.counter <= 49) {
        brick.style.backgroundColor = "rgb(95, 22, 33)";
        brick.style.color = "white";
    } else if(brick.counter <= 59) {
        brick.style.backgroundColor = "rgb(55, 0, 0)";
        brick.style.color = "white";
    } else if(brick.counter <= 69) {
        brick.style.backgroundColor = "rgb(15, 0, 0)";
        brick.style.color = "white";
    } else {
        brick.style.backgroundColor = "rgb(0, 0, 0)";
        brick.style.color = "white";
    }
}

function CreateBrickLine() {
    for(i=0; i<6; i++) {
        landNum = Math.floor(Math.random() * 10);
        if(landNum < 5) {
            createNewBrick((i*brickWidth), 0);
        }
    }
}

function brickLineDown() {
    bricks = document.querySelectorAll(".brick");
    bricks.forEach(e => {
        let topValue = parsePxToInt(e.style.top);
        topValue += brickHeight;
        topValue = parseIntToPx(topValue);
        e.style.top = topValue;
    });
    bricks.forEach(e => {
        const topValue = parsePxToInt(e.style.top);
        if(topValue >= 600 - brickHeight) {
            gameoverFn();
        }
    })
}

function gameoverFn() {
    offFrame();
    offRotateArrow();
    clearInterval(timerInterval);
    clearInterval(infoInterval);
    overCounter.innerText = `조작 횟수 : ${counterNum}회`
    overScore.innerText = `최종 점수 : ${scoreNum}점`;
    overTimer.innerText = `플레이 시간 : ${timerNum}초`;
    gameoverScreen.style.display = "flex";
}

function parsePxToInt(value) {
    return parseInt(value.replace("px", ""));
}

function parseIntToPx(value) {
    return value + "px";
}

function onDVM() {
    displayInfo();
    infoInterval = setInterval(displayInfo, 1);
}
//start
timerFn();
let timerInterval = setInterval(timerFn, 1000);
let infoInterval;
onRotateArrow();
highlighter.addEventListener("click", hideGuidance);
CreateBrickLine();