var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var players = [
    {
        id: 0,
        color: 'red',
        keyLeft: '39',
        keyRight: '37',
        posX: 50,
        score: 0,
        rightPressed: false,
        leftPressed: false,
        ballPos: { x: 0, y: 0 },
        ballDel: { x: 1, y: 1 }
    },
    {
        id: 1,
        color: 'blue',
        keyLeft: '55',
        keyRight: '56',
        posX: 10,
        score: 0,
        rightPressed: false,
        leftPressed: false,
        ballPos: { x: 0, y: 0 },
        ballDel: { x: 1, y: 1 }
    }
]

var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;

var brickRowCount = 5;
var brickColumnCount = 3;
var countBricks = brickRowCount * brickColumnCount;
var countDesBricks = 0;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];

for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBall() {
    for (var i = 0; i < players.length; i++) {

        ctx.beginPath();
        ctx.arc(players[i].ballPos.x, players[i].ballPos.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = players[i].color;
        ctx.fill();
        ctx.closePath();
    }
}

function drawPaddle() {
    for (var i = 0; i < players.length; i++) {
        ctx.beginPath();
        ctx.rect(players[i].posX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = players[i].color;
        ctx.fill();
        ctx.closePath();
    }
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (var i = 0; i < players.length; i++) {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (
                        players[i].ballPos.x > b.x && players[i].ballPos.x < b.x + brickWidth && players[i].ballPos.y > b.y && players[i].ballPos.y < b.y + brickHeight
                    ) {
                        players[i].ballDel.y *= -1;
                        b.status = 0;
                        players[i].score++;
                    }
                }
            }
        }
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    for (var i = 0; i < players.length; i++) {
        if (players[i].ballPos.x + players[i].ballDel.x > canvas.width - ballRadius || players[i].ballPos.x + players[i].ballDel.x < ballRadius) players[i].ballDel.x *= -1;
        if (
            players[i].ballPos.y + players[i].ballDel.y > canvas.height - ballRadius - paddleHeight &&
            players[i].ballPos.x + players[i].ballDel.x < players[i].posX + paddleWidth &&
            players[i].ballPos.x + players[i].ballDel.x > players[i].posX
        )
            players[i].ballDel.x *= -1;
        else if (players[i].ballPos.y + players[i].ballDel.y < ballRadius) {
            players[i].ballDel.x *= -1;
        } else if (players[i].ballPos.y + players[i].ballDel.y > canvas.height - ballRadius) {
            alert(players[i].id + " loss");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
        }
        if (players[i].rightPressed && paddleX < canvas.width - paddleWidth) {
            players[i].posX += 7;
        } else if (players[i].leftPressed && players[i].posX > 0) {
            players[i].posX -= 7;
        }

        players[i].ballPos.x += players[i].ballDel.x;
        players[i].ballPos.y += players[i].ballDel.y;
    }
}

var interval = setInterval(draw, 100);


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    for (var i = 0; i < players.length; i++) {

        if (e.keyCode == players[i].keyLeft) {
            players[i].rightPressed = true;
        } else if (e.keyCode == players[i].keyRight) {
            players[i].leftPressed = true;
        }
    }
}
function keyUpHandler(e) {
    for (var i = 0; i < players.length; i++) {

        if (e.keyCode == players[i].keyLeft) {
            players[i].rightPressed = false;
        } else if (e.keyCode == players[i].keyRight) {
            players[i].leftPressed = false;
        }
    }
}

