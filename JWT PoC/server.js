const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

// this is middleware to auth tokens. Verifies each request
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

app.get('/', function(req, res) {
  // the middleware provides req.user, if its undefined then we know there wasnt a validtoken
  if (req.user) {
    res.send("server running. You are authorized")
  } else {
    res.json(req.authorized)
    // you could then verify req.authorized.userID in a database
  }
})

app.get("/userToken", function(req, res) {
  // Give the user an access token
  //console.log(req)
  if (req.headers.userid) {
    return res.json({token: jwt.sign({ userID: req.headers.userid}, 'thisIsTheSecretForOurAPI')})
  }
});


const PORT = process.env.PORT | 3128

app.listen(PORT, function(){
	console.log(`App is running on localhost:${PORT}`)
})