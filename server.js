const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()

const user = require ('./routes/user')

const PORT = process.env.PORT || 3128
const dbFile = './database/cookingApp.db'

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function(req, res) {
	res.send("Platr API")
})

app.use('/user', user);

app.listen(PORT, function(){
	console.log(`API is running on localhost:${PORT}`)
})