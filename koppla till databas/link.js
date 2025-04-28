const express = require('express')
const app = express()
const port = 4000
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "in4",
})
con.connect()

app.get('/Hej', (req, res) => {
  con.query("SELECT name from users", function(err, result, feilds){
    if(err) throw err;
    var text = "";
    result.forEach(element => {
      text+="<li>" + element.name + "</li>"
    });
    res.send("<h1>Användare</h1><br><ul>" + text + "</ul>")
  })
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})