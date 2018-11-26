const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const dbFile = './database/cookingApp.db'

const recipe = express()
recipe.use(bodyParser.urlencoded({extended: false}))
recipe.use(bodyParser.json())

function isEmpty(str) {
  return !str || 0 === str.length;
}

// token we can use:
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIyIiwiaWF0IjoxNTQzMTc0NjA4fQ.VvAXK5A7jcAdyuzTaxpe9B2SmYKUnNzeKA7-tIVtEVo
recipe.post("/", function(req, res) {
  if (isEmpty(req.body.name)) {
    return res.json({
      status: false,
      message: "Recipe needs a name"
    })
  }
  if (isEmpty(req.body.method)) {
    return res.json({
      status: false,
      message: "Method cannot be empty"
    })
  }
  if (!req.authorized.userID) {
    return res.json({
      status: false,
      message: "inivalid token"
    })
  }

  let db = new sqlite3.Database(dbFile)

  let sql = `INSERT INTO Recipe(name,description,creatorID, stars, created) VALUES('${req.body.name}','${req.body.method},'${req.authorized.userID}', 0, 'TODAYS DATE'')`;
  
  db.run(sql, function(err) {
    if(err) {
      return console.log(err.message)
    }

    //idOfIngredient = this.lastID
    return res.json({
        status: true,
        message: "Recipe added"
      });
    });

  })
 
  //return res.json({ response: true, createdBy: req.authorized.userID })
  // get user ID from token
  // req.user.userID

});


recipe.get("/", function(req, res) {
  // less information about all recipes
  let db = new sqlite3.Database(dbFile)

  // get first 10
  let sql = `SELECT name FROM Recipe LIMIT 10 0`;
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

recipe.get("/:recipeID", function(req, res) {
  // more information about induvidual recipe
  // return res.json({ response: true })

  let db = new sqlite3.Database(dbFile)
  let sql = `SELECT * FROM Recipe WHERE name='${req.params.name}'`

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    return res.json({
      status: true,
      recipes: rows
    })
  })
})

module.exports = recipe