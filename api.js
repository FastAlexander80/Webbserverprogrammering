const mysql2 = require("mysql2/promise")
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function getConnection(){
    return mysql2.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "in9",
    })
}

app.post("/login", async(req,res)=>{
    let connection = await getConnection()
    let sql = `SELECT * FROM users WHERE username = ?`
    let [results] = await connection.execute(sql, [
        req.body.username
    ])
    // innehåller results EN användare
    if (results.length !== 1) {
        res.sendStatus(401)
        return
    }
    let user = results[0]
    // kontrollera att det hashade lösenordet stämmer
    if (bcrypt.compareSync(req.body.password, user.pasword)){
        // Bra
        // skapa token och skicka
        console.log("We are in!")
        res.send("Hurra!")
        let paylode = {
            sub:user.id,
            name: user.name,
            username: user.username
        }
        let token = jwt.sign(paylode, "Jag har inte gjort inlämning 9")
        res.send(token)
    } else {
        // Go away
        res.sendStatus(401)
    }
})


// Anropas med GET /gen-hash?password=kalleanka
app.get("/gen-hash", async (req, res) => {
    const salt = await bcrypt.genSalt(10) // genererar ett salt till hashning
    const hashedPassword = await bcrypt.hash(req.query.password, salt) //hashar lösenordet
    res.send(hashedPassword) //Sickar tillbaka hashen/hashvärdet
  })

app.put("/anv/:id", async(req,res)=>{
    if(req.body.username && req.body.name && req.body){
        let connection = await getConnection()
        let sql = 'UPDATE users SET  username = ?, name = ?, pasword = ? WHERE id = ?';
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        let [results] = await connection.execute(sql, [
            req.body.username,
            req.body.name,
            hashedPassword,
            req.params.id,
        ])
        res.json(results)
        
    } else{
        res.sendStatus(422)
    }
})

app.post("/anv", async(req, res)=>{
    if(req.body && req.body.username && req.body.name){
        let user = req.body
        let connection = await getConnection()
        let sql = `INSERT INTO users (username, name, pasword) VALUES (?, ?, ?) `

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        let [results] = await connection.execute(sql, [
            req.body.username,
            req.body.name,
            hashedPassword,
        ])
        user.id = results.insertId
        user.password = hashedPassword
        res.json(user)
    }else {
        res.sendStatus(422)
    }
})


app.get("/users", async(req, res)=>{
    let connection = await getConnection()
    let sql = `Select * FROM users`
    let [result] = await connection.execute(sql)
    res.json(result)
})

app.get("/users/:id", async(req, res)=>{
    let connection = await getConnection()
    let sql = `SELECT * FROM users WHERE id = ?`
    let [results] = await connection.execute(sql, [req.params.id])
    res.json(results)
})

app.get("/1", (req, res) => {
    let users = [
        {
            name: "Alexander",
            age: 18,
        },
        {
            name: "Sarah",
            age: 18,
        },
        {
            name:"Taras",
            age:20,
        }
    ]
    res.json(users)
  })
app.get("/hej/:id", (req,res) => {
    res.send(req.params)
})
app.get("/hej", (req,res)=>{
    res.send(req.query)
})
app.get("/", (req,res)=>{
    res.send("<h1>Dokumentation av det här APIet</h1> <br> <h3>Viktiga Routes</h3> <br> <ul> <li>GET/users - Returnerar alla användare</li> <br> <li>GET/users/:id - Returnerar en user med angivet id</li> <br> <li>POST/anv - skapar en ny användare med ett hashat lösenord. Tar emot ett objekt i JSON format och lägger in i databasen</li> <br> <li> POST/anv/:id - Kollar så man finns i databasen och gör så att man kan ändra/uppdatera sitt lösenord och samtidigt lägger till ett salt och hashar det uppdaterade</li> <br> <li> POST/login - Icke färdig kod som kollar om man finns i databasen och skapar salt och hashning och ska fixa en token till användaren </li> <br> </ul> <br> <h3>Övriga Routes</h3> <br> <ul> <li>GET/gen-hash - Tar emot lösenordet i en databas och gör om den till ett hashat lösenord</li> <br> <li>GET/hej - ger en tom JSON objekt</li> <br> <li>GET/hej/:id - Ger en ett JSON objekt bestående av endast id</li> <br> <li>GET/1 - Skriver ut en lista med JSON objekt som är skrivet i koden</li></ul>")
})

app.listen(port, () => {
    console.log(`Example app listening on port ` + port)
    })