var express = require("express");
// var mongoose = require('mongoose');
var http = require("http");
var path = require("path");
// var fs = require("fs");
var socketIO = require("socket.io");
var app = express();

var server = http.Server(app);
var io = socketIO(server); //note: set to listen on HTTP server
//STUFF FOR MONGO
// mongoose.connect('mongodb://127.0.0.1/gridFS',{useNewUrlParser: true});
// var conn = mongoose.connection;

app.set("port", 8000);
app.use(express.static(path.join(__dirname+"/public")));

//----------------------------------------express routing----------------------------------------------
app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

server.listen(3000, () => console.log("App listening on port 3000"));

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
