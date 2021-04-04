const express = require('express')
const app = express()
const db = require("./app/database.js");

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.set("view engine", "pug")
app.get('/', (req, res) => { 
  res.render("index",{title:"index",message:"hello a  there"}) 
});


app.post('/get/mounted', async(req, res) => {
  var ticket_type = await db.select("SELECT ID,TICKET_TYPE_NAME,TICKET_TYPE_CODE FROM TICKET_TYPE");
  var tickets = await db.select("SELECT ID,TICKET_NAME,TICKET_MESSAGE,TICKET_TYPE,TICKET_ORDER,UPDATED_AT,CREATED_AT FROM TICKETS ORDER BY TICKET_ORDER");
  res.send({
    "TICKET_TYPE":ticket_type,
    "TICKETS":tickets
  });
  res.end();
});

//テーブル確認 PRAGMA TABLE_INFO("table name")

app.post('/post/addcard',async(req,res) => {
  var reqArr = [];
  for (const item in req.body) {
    if (Object.hasOwnProperty.call(req.body,item)) {
        reqArr.push(req.body[item]);
    }
  }
  var sql = "INSERT INTO TICKETS(ID,TICKET_NAME,TICKET_MESSAGE,TICKET_TYPE,TICKET_ORDER,UPDATED_AT,CREATED_AT) VALUES(NULL,?,?,?,?,NULL,NULL)";
  await db.insert(sql,reqArr);

  var ticket_type = await db.select("SELECT ID,TICKET_TYPE_NAME,TICKET_TYPE_CODE FROM TICKET_TYPE");
  var tickets = await db.select("SELECT ID,TICKET_NAME,TICKET_MESSAGE,TICKET_TYPE,TICKET_ORDER,UPDATED_AT,CREATED_AT FROM TICKETS  ORDER BY TICKET_ORDER");
  res.send({
    "TICKET_TYPE":ticket_type,
    "TICKETS":tickets,
  });
  res.end();
});

app.post('/post/updatecard',async(req,res) => {
  var reqArr = [];
  for (const item in req.body) {
    if (Object.hasOwnProperty.call(req.body,item)) {
        reqArr.push(req.body[item]);
    }
  }
  for await(item of reqArr) {
    var sql = "UPDATE TICKETS SET TICKET_NAME = ?, TICKET_MESSAGE = ?, TICKET_TYPE = ?, TICKET_ORDER = ? WHERE ID = ?";
    await db.update(sql,[
      item.TICKET_NAME,
      item.TICKET_MESSAGE,
      item.TICKET_TYPE,
      item.TICKET_ORDER,
      item.ID
    ]);
  }

  res.send("a");
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

app.listen(8080, () => console.log('app listening on port 8080!'))