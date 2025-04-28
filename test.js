var express = require('express');
var app = express();
var port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/index.html', (req, res) =>{
res.sendFile(__dirname + "/" + "index.html")
});

app.post("/target", function(req,res){
  let response=req.body
  res.send(response)
  //  res.send( 
  //   "namn : " + req.body.namn + "<br>" + "password : " + req.body.password + "<br>" + "email : "+ req.body.email + "<br>")
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})