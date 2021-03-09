const express = require('express')
const app = express()
var sqlite3 = require('sqlite3')

app.set("view engine", "pug")
app.get('/', (req, res) => {
  res.render("index",{title:"index",message:"hello there "})

  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('./myTicketDB.db');

  db.serialize(function() {
    db.run('CREATE TABLE IF NOT EXISTS TestTable (name TEXT, age INTEGER, sex TEXT)')


    db.each("SELECT name AS userName, age FROM TestTable", function(err, row) {
        console.log(row.userName + ": " + row.age);
    });
  });

  db.close();
})

app.listen(8000, () => console.log('Example app listening on port 8000!'))