const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'));

var game={};

app.get('/start', (req, res) => {
  var a = '';
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 15; i++)
    a += possible[(Math.floor(Math.random() * possible.length))];
  game[a] = {a:'',b:''};

  console.log(game.a);

  res.redirect('/game.html?valid=' + a);

})


app.get('/game_update',(req,res)=>{
  //console.log(req.query)

  if(req.query.uid==0){
    game[req.query.room].a+=(req.query.bt)
    res.send(game[req.query.room].b)
    game[req.query.room].b = "";
  }else if(req.query.uid==1){
    game[req.query.room].b.push(req.query.bt)
    res.send(game[req.query.room].a)
    game[req.query.room].a = "";
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
