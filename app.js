const express = require('express')
const app = express()

app.set("view engine", "pug")
app.get('/', (req, res) => {
  res.render("index",{title:"index",message:"hello there "})
})

app.listen(8000, () => console.log('Example app listening on port 8000!'))