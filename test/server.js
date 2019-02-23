//require the js packages used in the application
var express = require("express");
var mongoose = require('mongoose');
var http = require("http");
var path = require("path");
var fs = require("fs");
var socketIO = require("socket.io");
var app = express();

var server = http.Server(app);
var io = socketIO(server); //note: set to listen on HTTP server
//STUFF FOR MONGO
mongoose.connect('mongodb://127.0.0.1/gridFS',{useNewUrlParser: true});
var conn = mongoose.connection;

//-----------------------------mongo database functions---------------------------------------------------
/*
THERE ARE 2 KINDS OF OBJECTS: SIMPLE OBJECTS (almost everything) and AUDIOFILE OBJECTS
*/
//GET ANY SIMPLE OBJECTS
function getObject(collection_name,conditions,callback){
    conn.collection(collection_name).find(conditions).toArray(function(err,docs){
      if (callback && typeof callback === 'function') {
        callback(docs, "GOT:");
      };
    });
}
//POST TRANSCRIPT OBJECT (TRANSCRIPT OBJECT IS A SIMPLE OBJECT)
var transcriptSchema = new mongoose.Schema({audio_id:'string',transText:'string'});
var transcriptModel = mongoose.model('transcript',transcriptSchema,'transcripts');

function postTranscript(new_text,callback){
  var transcriptText = new transcriptModel({audio_id:'id_placeholder',transText:new_text});
  transcriptText.save(function(err){
    if (err) return handleError(err);
    transcriptModel.findOne({transText:new_text}).exec(function(err,trans){
      if (callback && typeof callback === 'function') {
        callback(trans, "POSTED:");
      };
    });
  });
}

function deleteObject(collection_name,conditions,callback){
  conn.collection(collection_name).find(conditions).toArray(function(err,results){
    if (callback && typeof callback === 'function') {
      callback(results, "DELETED:");
    };
    conn.collection(collection_name).deleteMany(conditions);
  });
};

function callconsole(arg,string){
  console.log(string);
  console.log(arg);
};

conn.once('open',()=>{
  /*
  postTranscript("wabalubba",callconsole);
  getObject('transcripts',{transText:"wabalubba"},callconsole);
  deleteObject('transcripts',{transText:'wabalubba'},callconsole);
  */
});

//-------------------------------------------------------------------------------------------------
app.set("port", 8000);

app.use(express.static(path.join(__dirname+"/public")));

//----------------------------------------express routing----------------------------------------------
app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

server.listen(8000, () => console.log("App listening on port 8000"));

//--------------------------------player creation and handling------------------------------------------

var players = {};

function createPlayerAttrb(player_id, username) {
  var player_attrb = {
    player_id: player_id,
    username: username,
    player_type: Math.round(Math.random()+1),
    audio_files: [],
    transcriptions: [],
    //add more as needed
  };
  return player_attrb;
};

//------------------------------------------sockets handlers---------------------------------------------
io.on("connection", function (socket) { //new instance is created with each new socket connection
  console.log("User connected: " + socket.id);
  socket.emit('newConnection', socket.id);

  //Startscene sockets
  socket.on("joinGame", (username, fn) => {
    var player_attrb = createPlayerAttrb(socket.id, username);
    players[socket.id] = player_attrb;
    socket.broadcast.emit("newPlayer", players[socket.id]);
    fn(players);
  });

  socket.on("sendAudio", (data) => {
    console.log(data);
    fs.writeFileSync('test.wav', Buffer.from(new Uint8Array(data)));
  });

  //Waitscene sockets

  //Playerscenes sockets


  socket.on("disconnect", function () { //do not pass socket as parameter; it takes socket object from parent function
    console.log("User disconnected: " + socket.id);
    delete players[socket.id];
    io.emit("playerDisconnect", socket.id);
  });
});
