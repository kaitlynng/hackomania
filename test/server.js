//require the js packages used in the application
var express = require("express");
var mongoose = require('mongoose');
var http = require("http");
var path = require("path");
var crypto = require('crypto');
var fs = require("fs");
var socketIO = require("socket.io");
var app = express();

var server = http.Server(app);
var io = socketIO(server); //note: set to listen on HTTP server
//STUFF FOR MONGO
mongoose.connect('mongodb://94.237.73.149:27017/jiazua',{useNewUrlParser: true});
var conn = mongoose.connection;

//--------------------------adding audiofiles------------------------------------------------------------

var audio_ids = ["audio_1", "audio_2", "audio_3"];
var audioFiles = [];

for(i=0;i<audio_ids.length;i++) {
  var json_path = path.join(__dirname, 'audio_files', audio_ids[i]+'.wav');
  audio_file = fs.readFileSync(json_path);
  audioFiles.push(audio_file);
  //audioFiles.push(fs.readFileSync(audio_ids[i]));
};

//-----------------------------mongo database functions---------------------------------------------------

/*
THERE ARE 2 KINDS OF OBJECTS: SIMPLE OBJECTS (almost everything) and AUDIOFILE OBJECTS
*/

//================================= simple objects ==========================================================
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

function postTranscript(new_text, audioFile_id,callback){
  console.log(new_text);
  var transcriptText = new transcriptModel({audio_id:audioFile_id,transText:new_text});
  transcriptText.save(function(err){
    if (err) return handleError(err);
    transcriptModel.findOne({transText:new_text}).exec(function(err,trans){
      if (callback && typeof callback === 'function') {
        callback(trans, "POSTED:");
      };
    });
  });
}
//DELETE ANY SIMPLE OBJECT
function deleteObject(collection_name,conditions,callback){
  conn.collection(collection_name).find(conditions).toArray(function(err,results){
    if (callback && typeof callback === 'function') {
      callback(results, "DELETED:");
    };
    conn.collection(collection_name).deleteMany(conditions);
  });
};

//============================ audiofile objects =========================================================
var audioFolderPath = path.join(__dirname,'audio_files');
function gfsFileName(file) {
  var buf = crypto.randomBytes(16);
  var fileName = buf.toString('hex') + path.extname(file);
  return fileName;
}

//GET AUDIOFILE BY NAME
function getAudioByName(file_name,callback){
  var outputPath = path.join(audioFolderPath,'placeholder.wav');

  var gfsBucket = new mongoose.mongo.GridFSBucket(conn.db,{bucketName:'audiofiles'});
  var downloadStream = gfsBucket.openDownloadStreamByName(file_name);
  var outputStream = fs.createWriteStream(outputPath);

  downloadStream.pipe(outputStream)
  .on('finish',function(){
    console.log(outputPath + " successfully written")
    if (callback && typeof callback === 'function') {
        callback();
      };
  });
}

//GET AUDIOFILE BY OTHER MEANS
function getAudioByKeys(filter,callback){
  var gfsBucket = new mongoose.mongo.GridFSBucket(conn.db,{bucketName:'audiofiles'});

  var options = {limit:1}
  var downloadStream = gfsBucket.find(filter,options)

  let retrieved_filename;
  downloadStream.toArray(function(err,files){
      retrieved_filename = files[0].filename;
      getAudioByName(retrieved_filename,callback);
  });
};

//POST AUDIOFILE
function writeAudio(file_name){
  audioFilePath = path.join(audioFolderPath,file_name);

  var gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName:'audiofiles'});
  var writeStream = gfsBucket.openUploadStream(gfsFileName(file_name),{
    metadata:{
      original_audio: file_name,
      transcribe_count: 0
    }
  });
  fs.createReadStream(audioFilePath).pipe(writeStream);

  writeStream.on('finish',function(file){
    console.log( file.filename + ' Written to DB');
  });
};

//DELETE AUDIOFILE
function deleteAudioByID(file_id){
  var audioGFSid = new mongoose.mongo.ObjectID(file_id);

  var gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName:'audiofiles'});

  gfsBucket.delete(audioGFSid,function(err){
    if(err != null){
      console.log("ERROR: no file with _id:" + file_id + " found");
      return;
    }
    console.log('audio with _id:' + file_id+" deleted");
  });
}
//***************************************
function deleteAudioByKeys(conditions){

}


function callconsole(arg,string){
  console.log(string);
  console.log(arg);
};


conn.once('open',()=>{
  deleteAudioByID("5c71157da8c2dfa20ece96ba");
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

var game_width;
var game_height;

var players = {};
var playersPos = {};

var player_num = 2;

var partners = []; //[[partner1id, partner2id], [partner1id, partner2id], [partner1id, partner2id]]

function createPlayerAttrb(player_id, username) {
  var player_attrb = {
    player_id: player_id,
    username: username,
    player_type: 0, //1 for player1 and 2 for player2
    audio_files: [],
    transcriptions: [],
    partner_id: "",
    //add more as needed
  };
  return player_attrb;
};

function startGame() {
  console.log("In startgame");
  var temp = [[], []];
  playertype_tog = 0;
  //assign playertype
  Object.keys(players).forEach((id) => {
    players[id].player_type = playertype_tog+1;
    temp[playertype_tog].push(id);
    playertype_tog = ((playertype_tog == 0) ? 1 : 0);
  });
  //match partners
  for(i=0; i<temp[0].length; i++) {
    players[temp[0][i]].partner_id = temp[1][i];
    players[temp[1][i]].partner_id = temp[0][i];
    partners.push([temp[0][i], temp[1][i]]);
  };

  //init players positions
  Object.keys(players).forEach((id) => {
    if(players[id]["player_type"] == 1) {
      playersPos[id] = {
        x: Math.round(Math.random()*(game_width-40)+20),
        y: Math.round(Math.random()*(game_height-40)+20),
      };
    }
  });
  //send audiofile
  var audio_file = audioFiles[0];
  var placeholder_id = 'placeholder_id';

  io.emit("startGame", players, playersPos, audio_file,audioFile_id);
};

//------------------------------------------sockets handlers---------------------------------------------
io.on("connection", function (socket) { //new instance is created with each new socket connection
  console.log("User connected: " + socket.id);
  socket.emit('newConnection', socket.id);

  //Startscene sockets
  socket.on("joinGame", (username, width, height, fn) => {
    game_width = width;
    game_height = height;
    var player_attrb = createPlayerAttrb(socket.id, username);
    players[socket.id] = player_attrb;
    socket.broadcast.emit("newPlayer", players[socket.id]);
    fn(players);
    if(Object.keys(players).length>=player_num){
      startGame();
    };
  });

  socket.on("sendAudio", (data) => {
    fs.writeFile('audio_files/test.wav', Buffer.from(new Uint8Array(data)), ()=>{
      //writeAudio('test.wav');
    }); //complete synchronously
  });

  //Waitscene sockets
  socket.emit("startGame", (players, playersPos));

  //Player movement socket
  socket.on('playerMove',(new_pos)=>{
    playersPos[socket.id] = new_pos;
    var id = socket.id;
    socket.broadcast.emit('otherPlayerMove',{id:new_pos});
  });

  //

  socket.on('finishTranscript',(transcript,audioFile_id)=>{
  function testing(transcript,audioFile_id){
    postTranscript(transcript,audioFile_id);
    getAudioByKeys({},function(){
      var json_path = path.join(__dirname, 'audio_files', 'placeholder.wav')
      audio_file = fs.readFileSync(json_path);
      socket.emit('loadAudio',audio_file);
    })

    var word_list = transcript.trim().split(/\s+/);
    var num_coords = word_list.length();
    var coords_array [];
    for (var i = 0; i < num_coords; i++) {
      var x = Math.round(Math.random()*(game_width-40)+20);
      var y = Math.round(Math.random()*(game_height-40)+20);
      var coord = [x,y];
      coords_array.push(coord);
    }

    //NEED TO IMPLEMENT RANDOM SPAWNING
    socket.emit('incomingwords',word_list,coords_array,socket.id)

  }});

  socket.on('collision',(score,item)=>{

  })




  //Playerscenes sockets



  socket.on("disconnect", function () { //do not pass socket as parameter; it takes socket object from parent function
    console.log("User disconnected: " + socket.id);
    delete players[socket.id];
    io.emit("playerDisconnect", socket.id);
  });
});
