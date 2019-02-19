var express = require('express');
var path = require('path');

var conn = express();
var router = express.Router();

router.use(express.static(path.join(__dirname+'/public')));
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});


conn.use('/', router);
var port = 3000
conn.listen(port);
console.log('server at port:',port);
