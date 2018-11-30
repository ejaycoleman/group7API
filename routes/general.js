const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const dbFile = './database/cookingApp.db'

const general = express()
general.use(bodyParser.urlencoded({extended: false}))
general.use(bodyParser.json())

function isEmpty(str) {
  return !str || 0 === str.length;
}

general.get("/categories", function(req, res) {
  // get all categories
  if (!req.authorized.userID) {
    return res.json({
      status: false,
      message: "inivalid token"
    })
  }

  let db = new sqlite3.Database(dbFile)

  let limit = isEmpty(req.body.amount)? 10 : req.body.amount
  let offset = isEmpty(req.body.offset)? 0 : req.body.offset

  // get first 10
  let sql = `SELECT name FROM Category LIMIT ${limit} OFFSET ${offset}`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err
    }
    return res.json({
      status: true,
      recipes: rows
    })
  })
})

module.exports = general