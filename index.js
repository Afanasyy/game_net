const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

var game = {};

app.get("/start", (req, res) => {
  var a = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 15; i++)
    a += possible[Math.floor(Math.random() * possible.length)];
  game[a] = {
    a: 0,
    b: 0,
    start: -2,
    a_x: 0,
    a_y: 0,
    a_d_x: 0,
    a_d_y: 0,
    b_x: 0,
    b_y: 0,
    b_d_x: 0,
    b_d_y: 0,
  };

  console.log(game.a);

  res.redirect("/game.html?valid=" + a);
});

app.get("/startGame", (req, res) => {
  game[req.query.room].start += 1;
  res.send("" + game[req.query.room].start);
});

app.get("/get_pos_ball", (req, res) => {
  console.log(req.query);
  if (req.query.uid == 0) {
    game[req.query.room].a_x = req.query.x;
    game[req.query.room].a_y = req.query.y;
    game[req.query.room].a_d_x = req.query.dx;
    game[req.query.room].a_d_y = req.query.dy;
    res.send({
      id: 1,
      x: game[req.query.room].b_x,
      y: game[req.query.room].b_y,
      dx: game[req.query.room].b_d_x,
      dy: game[req.query.room].b_d_y,
    });
  } else if (req.query.uid == 1) {
    game[req.query.room].b_x = req.query.x;
    game[req.query.room].b_y = req.query.y;
    res.send({
      id: 0,
      x: game[req.query.room].a_x,
      y: game[req.query.room].a_y,
      dx: game[req.query.room].a_d_x,
      dy: game[req.query.room].a_d_y,
    });
  }
});

app.get("/game_update", (req, res) => {
  if (game[req.query.room].start < 0) {
    res.send("" + game[req.query.room].start);
    return;
  }
  //console.log(req.query);

  if (req.query.uid == 0) {
    //if (req.query.bt != "0")
    game[req.query.room].a = req.query.bt;

    res.send(game[req.query.room].b);
    console.log(game);
  } else if (req.query.uid == 1) {
    //if (req.query.bt != "0")
    game[req.query.room].b = req.query.bt;

    res.send(game[req.query.room].a);
    console.log(game);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
