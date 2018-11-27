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

// Add new recipes
recipe.post("/", function(req, res) {
  if (isEmpty(req.body.name)) {
    return res.json({
      status: false,
      message: "Recipe needs a name"
    });
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
  console.log(req.body.name, req.body.method, req.authorized.userID)

  let sql = `INSERT INTO Recipe(name, description, creatorID, stars, created) VALUES('${req.body.name}', '${req.body.method}', '${req.authorized.userID}', '0', 'TODAYS DATE')`;
  
  db.run(sql, function(err) {
    if(err) {
      return console.log(err.message)

    }
    return res.json({
      status: true,
      message: "Recipe added"
    });

  })
});

// Get list of all recipes
recipe.get("/", function(req, res) {
  // less information about all recipes
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
  let sql = `SELECT name FROM Recipe LIMIT ${limit} OFFSET ${offset}`;
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
  if (!req.authorized.userID) {
    return res.json({
      status: false,
      message: "inivalid token"
    })
  }

  let db = new sqlite3.Database(dbFile)
  let sql = `SELECT * FROM Recipe WHERE recipeId='${req.params.recipeID}'`

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      return res.json({
        status: true,
        recipes: rows
      })
    } else {
      return res.json({
        status: false,
        message: 'ID unknown'
      })
    }
  })
})

recipe.post("/:recipeID/ingredient", function(req, res) {
  if (!req.authorized.userID) {
    return res.json({
      status: false,
      message: "inivalid token"
    })
  }

  let recipe_id = req.params.recipeID
  let db = new sqlite3.Database(dbFile)
  db.serialize(function() {
    let existingIngredientsQuery = `SELECT ingredientID FROM Ingredient WHERE name = '${req.body.name}'` 
    db.all(existingIngredientsQuery, [], (err, rows) => {
      if (err) {
        throw err;
      }

      let idOfIngredient

      if (rows == 0) {
        const addToLinkQuery = `INSERT INTO Ingredient(name) VALUES('${req.body.name}')`

        db.run(addToLinkQuery, function(err) {
          if(err) {
            return console.log(err.message)
          }

          idOfIngredient = this.lastID
          const addToConnectionQuery = `INSERT INTO RecipeInfo(recipeID, ingredientID) VALUES('${recipe_id}','${idOfIngredient}')`

          db.run(addToConnectionQuery)
          return res.send("Added ingredient ")
        } )
      } else {
        idOfIngredient = rows[0].ingredientID
        const addToConnectionQuery = `INSERT INTO RecipeInfo(recipeID, ingredientID) VALUES('${recipe_id}','${idOfIngredient}')`
        db.run(addToConnectionQuery)
        return res.send("Added ingredient ")
      }

      const addToConnectionQuery = `INSERT INTO RecipeInfo(recipeID, ingredientID) VALUES('${recipe_id}','${idOfIngredient}')`
    });  
  })
});

module.exports = recipe