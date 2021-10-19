var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var gameRoom = window.location.href.split("=")[1];

var players = [
  {
    id: 0,
    color: "red",
    keyLeft: "37",
    keyRight: "39",
    posX: 130,
    score: 0,
    rightPressed: false,
    leftPressed: false,
    ballPos: { x: canvas.width / 2 - 25, y: canvas.height - 30 },
    ballDel: { x: -2, y: -2 },
  },
  {
    id: 1,
    color: "blue",
    keyLeft: "65",
    keyRight: "68",
    posX: 300,
    score: 0,
    rightPressed: false,
    leftPressed: false,
    ballPos: { x: canvas.width / 2 + 25, y: canvas.height - 30 },
    ballDel: { x: 2, y: -2 },
  },
];

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
    ctx.arc(
      players[i].ballPos.x,
      players[i].ballPos.y,
      ballRadius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = players[i].color;
    ctx.fill();
    ctx.closePath();
  }
}

function drawPaddle() {
  for (var i = 0; i < players.length; i++) {
    ctx.beginPath();
    ctx.rect(
      players[i].posX,
      canvas.height - paddleHeight,
      paddleWidth,
      paddleHeight
    );
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
            players[i].ballPos.x > b.x &&
            players[i].ballPos.x < b.x + brickWidth &&
            players[i].ballPos.y + ballRadius > b.y &&
            players[i].ballPos.y - ballRadius < b.y + brickHeight
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
    if (
      players[i].ballPos.x + players[i].ballDel.x > canvas.width - ballRadius ||
      players[i].ballPos.x + players[i].ballDel.x < ballRadius
    )
      players[i].ballDel.x *= -1;
    if (
      players[i].ballPos.y + players[i].ballDel.y >
        canvas.height - ballRadius - paddleHeight &&
      players[i].ballPos.x + players[i].ballDel.x <
        players[i].posX + paddleWidth &&
      players[i].ballPos.x + players[i].ballDel.x > players[i].posX
    )
      players[i].ballDel.y *= -1;
    else if (players[i].ballPos.y + players[i].ballDel.y < ballRadius) {
      players[i].ballDel.y *= -1;
    } else if (
      players[i].ballPos.y + players[i].ballDel.y >
      canvas.height - ballRadius
    ) {
      /*alert(players[i].color + " loss\n" + players[0].score + " / " + players[1].score);
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game*/
      players[i].ballDel.y *= -1;
    }
    if (
      players[i].rightPressed &&
      players[i].posX < canvas.width - paddleWidth
    ) {
      players[i].posX += 7;
    } else if (players[i].leftPressed && players[i].posX > 0) {
      players[i].posX -= 7;
    }

    players[i].ballPos.x += players[i].ballDel.x;
    players[i].ballPos.y += players[i].ballDel.y;

    players[i].rightPressed = false;
    players[i].leftPressed = false;
  }
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onload = function () {};
}

var interval = setInterval(draw, 50);

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
  for (var i = 0; i < players.length; i++) {
    if (e.keyCode == players[i].keyRight) {
      httpGetAsync(
        "/game_update?room=" + gameRoom + "&uid=" + players[i].id + "&bt=R",
        (test) => {
          console.log(test);
        }
      );
      players[i].rightPressed = true;
    } else if (e.keyCode == players[i].keyLeft) {
      httpGetAsync(
        "/game_update?room=" + gameRoom + "&uid=" + players[i].id + "&bt=L",
        (test) => {
          console.log(test);
        }
      );
      players[i].leftPressed = true;
    }
  }
}
