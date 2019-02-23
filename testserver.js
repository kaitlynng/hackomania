var express = require('express')
var app = express()
app.get('/about', function (req, res) {
  res.send('about')
})
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(3001,"0.0.0.0");