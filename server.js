const express = require('express')
const app = express()
const port = 5000

app.get('/greet', (req, res) => {
res.send("<h1> Hej " + req.query.name + "</h1>")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})