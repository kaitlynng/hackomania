//require the js packages used in the application
var express = require("express");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");
//soma's comment
var app = express();
//Express creates a HTTP server for you
//but creating a HTTP server yourself is useful if you want to reuse to HTTP server e.g. for sockets
var server = http.Server(app);
//set io to listen to events on the HTTP server
var io = socketIO(server);

app.set("port", 8000);

//set the directory where static javascript, css and asset files are stored
app.use(express.static(path.join(__dirname+"/public")));

//Routing --> to be moved to a separate routes.js file when populated
app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

//note that it is SERVER.listen and not APP.listen, as  sockets is connected to HTTP instance server
server.listen(8000, () => console.log("App listening on port 8000"));

//player creation and handling
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




//sockets handlers
io.on("connection", function (socket) { //new instance is created with each new socket connection
  console.log("User connected: " + socket.id);
  socket.emit('newConnection', socket.id);

  //Startscene sockets
  socket.on("joinGame", (username, fn) => {
    var player_attrb = createPlayerAttrb(socket.id, username);
    socket.broadcast.emit("newPlayer", player_attrb);
    fn(player_attrb);
  });

  //Waitscene sockets

  //Playerscenes sockets


  socket.on("disconnect", function () { //do not pass socket as parameter; it takes socket object from parent function
    console.log("User disconnected: " + socket.id);
  });
});
