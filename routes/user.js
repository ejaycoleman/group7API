const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const dbFile = './database/cookingApp.db'
const jwt = require('jsonwebtoken')

const user = express()
user.use(bodyParser.urlencoded({extended: false}))
user.use(bodyParser.json())

function isEmpty(str) {
  return !str || 0 === str.length;
}

user.post("/", function(req, res) {
  if (isEmpty(req.body.userID)) {
    res.status(400)
    return res.json({
      response: false,
      message: "User needs an ID"
    })
  }

  let db = new sqlite3.Database(dbFile);
  
  let sql = 'INSERT INTO User(userID) VALUES(?)'  

  db.run(sql, [req.body.userID], function(err) {
    if (err) {
      throw err;
    } else {
      res.status(200)
      return res.json({
        response: true,
        message: "user created."
      });
    }
  })
});

user.get("/:userID", function(req, res) {
  let db = new sqlite3.Database(dbFile);

  let sql = 'SELECT * FROM User WHERE userID = ?'

  console.log(req.params.userID)
   
  db.get(sql, [parseInt(req.params.userID)], (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      res.status(200)
      
      return res.json({
        response: true,
        message: row,
        token: jwt.sign({ userID: req.params.userID}, 'thisIsTheSecretForOurAPI')
      });

      // if (req.headers.userid) {
      //   return res.json({token: jwt.sign({ userID: req.headers.userid}, 'thisIsTheSecretForOurAPI')})
      // }
      // UNSURE IF JWT NEEDS TO BE IMPORTED AGAIN

    } else {
      res.status(400)
      return res.json({
        response: false,
        message: "user not found"
      })
    }
  })
})

module.exports = user