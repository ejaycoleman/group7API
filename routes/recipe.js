const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const dbFile = './database/cookingApp.db'

const recipe = express()
recipe.use(bodyParser.urlencoded({extended: false}))
recipe.use(bodyParser.json())

recipe.post("/", function(req, res) {
  return res.json({ response: true })
  // get user ID from token
});

recipe.get("/:recipeID", function(req, res) {
  return res.json({ response: true })
})

module.exports = recipe