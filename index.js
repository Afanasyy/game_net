const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'));

app.get('/start',(req,res)=>{
    var a = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 15; i++)
        a += possible[(Math.floor(Math.random() * possible.length))];

    res.redirect('/game.html?valid=' + a);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
