const mysql2 = require("mysql2/promise")
const express = require('express')
const app = express()
const port = 3000

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

module.exports = {
    getUsers
}
app.get("/users",async (req,res) => {
    try{
        const users = await getUsers();
        var text = ""
        users.forEach(element => {
            text += "<li>" + element.name + "</li>"
        });
        res.send("<h1>Användare</h1><br><ul>" + text + "</ul>")
    } catch(error){
        res.status(500).json({error: "Fel"})
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ` + port)
    })