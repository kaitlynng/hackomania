//require the js packages used in the application
var express = require("express");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");

var app = express();
//Express creates a HTTP server for you
//but creating a HTTP server yourself is useful if you want to reuse to HTTP server e.g. for sockets
var server = http.Server(app);
//set io to listen to events on the HTTP server
var io = socketIO(server);

//dictionary of playerinfos sorted by playerId, will move to a database later
var players = {};

//default values for new players
function createNewPlayer(socketId) {
  return {
    x: Math.floor(Math.random()*700)+50,
    y:Math.floor(Math.random()*500)+50,
    vx: 0.05, //velocity to achieve smooth motion of character, range 0-1
    vy: 0.05,
    playerId: socketId};
};

app.set("port", 8000);

//set the directory where static javascript, css and asset files are stored
app.use(express.static(path.join(__dirname+"/public")));

//Routing --> to be moved to a separate routes.js file when populated
app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

//note that it is SERVER.listen and not APP.listen, as  sockets is connected to HTTP instance server
server.listen(8000, () => console.log("App listening on port 8000"));

//sockets handlers
io.on("connection", function (socket) { //new instance is created with each new socket connection
  console.log("User connected: " + socket.id);
  players[socket.id] = createNewPlayer(socket.id); //adds new player to the dictionary of players
  socket.emit("currentPlayers", players); //emits to the new connection
  socket.broadcast.emit("newPlayer", players[socket.id]); //emits to everyone except the new connection

  socket.on("disconnect", function () { //do not pass socket as parameter; it takes socket object from parent function
    console.log("User disconnected: " + socket.id);
    delete players[socket.id];
    io.emit("playerDisconnect", socket.id); //broadcasts everyone to delete the player as well
  });

  //called when player moves, broadcasts for other players to update position data
  socket.on("playerMove", (moveData) => {
    players[socket.id].x = moveData.x;
    players[socket.id].y = moveData.y;
    socket.broadcast.emit("otherPlayerMoved", players[socket.id]);
  });
});
