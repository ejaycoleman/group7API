// libraries
const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const jwt = require('jsonwebtoken')

// route modules
const user = require ('./routes/user')
const recipe = require('./routes/recipe')

// constants
const PORT = process.env.PORT || 3128
const dbFile = './database/cookingApp.db'

const app = express()

// middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'thisIsTheSecretForOurAPI', function(err, decode) {
      if (err) { 
        req.authorized = false
      } else {
        req.authorized = decode
      }
      next()
    })
  } else {
    req.user = false
    next()
  }
})


// routes
app.get('/', function(req, res) {
	res.send("Platr API")
})
app.use('/user', user)
app.use('/recipe', recipe)

app.listen(PORT, function(){
	console.log(`API is running on localhost:${PORT}`)
})