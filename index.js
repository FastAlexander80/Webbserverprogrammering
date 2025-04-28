const express = require('express');
const mysql2 = require("mysql2/promise")
const app = express();
const expbs = require('express-handlebars');
const port = 5000

app.engine('handlebars', expbs.engine());
app.set('view engine', 'handlebars')
app.set('views', './views')

async function getConnection(){
    return mysql2.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "in4",
    })
}
async function getUsers(){
    const connection = await getConnection()
    const [rows] = await connection.execute("SELECT name FROM users")
    await connection.end()
    return rows;
    
}

app.get("/users",async (req,res) => {
    try{
        const users = await getUsers();        
        res.render("users", { users: users })
    }
    catch(error){
        console.log(error);
        
        res.status(500).json({error: "Fel"})
    }
})

app.listen(port, ()=>{
    console.log("Now listening on port " + port)
})