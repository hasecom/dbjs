const express = require('express')
const app = express()
const db = require("./app/database.js");
app.set("view engine", "pug")
app.get('/', (req, res) => { 
  res.render("index",{title:"index",message:"hello there"}) 
});


app.post('/get/mounted', async(req, res) => {
  var ticket_type = await db.select("SELECT ID,TICKET_TYPE_NAME,TICKET_TYPE_CODE FROM TICKET_TYPE");
  var tickets = await db.select("SELECT ID,TICKET_NAME,TICKET_MESSAGE,TICKET_TYPE,UPDATED_AT,CREATED_AT FROM TICKETS");
  res.send({
    "TICKET_TYPE":ticket_type,
    "TICKETS":tickets
  });
  res.end();
});

//テーブル確認 PRAGMA TABLE_INFO("table name")


app.get('/api',(req,res) => {
  res.write("{aaa}");
  res.end();
});

app.get('/createtables',(req, res)=>{
  res.send('success created tables');
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('./myTicketDB.db');

  db.serialize(function(e){
    /*テーブル 
      ●TICKETS
        ID              INTEGER    PRIMARY KEY AUTOINCREMENT
        TICKET_NAME     TEXT
        TICKET_MESSAGE  TEXT
        TICKET_TYPE     INTEGER
        TICKET_ORDER    INTEGER
        UPDATED_AT      TEXT       NOT NULL DEFAULT
        CREATED_AT      TEXT

      ●TICKET_TYPE
        ID                  INTEGER
        TICKET_TYPE_NAME    TEXT
        TICKET_TYPE_CODE    INTEGER NOT NULL
    */

    db.run("CREATE TABLE IF NOT EXISTS TICKETS (ID INTEGER PRIMARY KEY AUTOINCREMENT,TICKET_NAME TEXT,TICKET_MESSAGE TEXT,TICKET_TYPE INTEGER,TICKET_ORDER INTEGER,UPDATED_AT TEXT NOT NULL ON CONFLICT REPLACE DEFAULT (DATETIME('now', 'localtime')),CREATED_AT TEXT NOT NULL ON CONFLICT REPLACE DEFAULT (DATETIME('now', 'localtime')))");
    //db.run("CREATE TRIGGER TRIGGER_TICKETS_UPDATED_AT AFTER UPDATE ON TICKETS BEGIN UPDATE TICKETS SET UPDATED_AT = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid; END;");
    db.run("CREATE TABLE IF NOT EXISTS TICKET_TYPE (ID INTEGER PRIMARY KEY AUTOINCREMENT,TICKET_TYPE_NAME TEXT,TICKET_TYPE_CODE INTEGER NOT NULL)");
  
    /*
    
    */
  });
  db.close();
});

app.listen(8000, () => console.log('app listening on port 8000!'))