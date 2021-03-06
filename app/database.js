var sqlite3 = require('sqlite3').verbose();

class DB {
    static get() {
      var database = new sqlite3.Database("myTicketDB.db");
      return database
    }
  }

module.exports = class Request{
    static async select(sql){
        const db = DB.get()
        let result = []
        return new Promise((resolve, reject) => {
            db.serialize(() => {
              db.all(sql,
                (err, rows) => {
                    if (err) return reject(err)
                    rows.forEach(row => {
                        result.push(row)
                    })
                    return resolve(result)
                  })
                })
        })
    }
    static async insert(sql,params){
      const db = DB.get()
      return new Promise((resolve, reject) => {
          db.serialize(() => {
            db.run(sql, params, (err) => {
            if (err) reject(err);
            resolve();
          })
        })
      })
    }
    static async update(sql,params){
      const db = DB.get();
      return new Promise((resolve,reject)=>{
        db.serialize(() => {
          db.run(sql,params,(err)=>{
            if(err) reject(err);
            resolve();
          })
        })
      })
    }
  }
