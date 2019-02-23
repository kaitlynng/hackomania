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
mongoose.connect('mongodb://127.0.0.1/jiazua',{useNewUrlParser: true});
var conn = mongoose.connection;

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
  var buf = crypto.randomBytes(16)
  var fileName = buf.toString('hex') + path.extname(file);
  return fileName;
}

//GET AUDIOFILE BY NAME
function getAudioByName(file_name){
  var outputPath = path.join(audioFolderPath,file_name);

  var gfsBucket = new mongoose.mongo.GridFSBucket(conn.db,{bucketName:'audiofiles'});
  var downloadStream = gfsBucket.openDownloadStreamByName(file_name);
  var outputStream = fs.createWriteStream(outputPath);

  downloadStream.pipe(outputStream)
  .on('finish',function(){
    console.log(outputPath + " successfully written")
  });
}

//GET AUDIOFILE BY OTHER MEANS
function getAudioByKeys(filter){
  var gfsBucket = new mongoose.mongo.GridFSBucket(conn.db,{bucketName:'audiofiles'});

  var options = {limit:1}
  var downloadStream = gfsBucket.find(filter,options)

  let retrieved_filename;
  downloadStream.toArray(function(err,files){
      retrieved_filename = files[0].filename;
      getAudioByName(retrieved_filename);
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
function deleteAudioByKeys(filter){
  var gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName:'audiofiles'});

  var options = {limit:1}
  var downloadStream = gfsBucket.find(filter,options)

  let retrieved_id;
  downloadStream.toArray(function(err,files){
      retrieved_id = files[0]._id.toString();
      deleteAudioByID(retrieved_id);
});
}


function callconsole(arg,string){
  console.log(string);
  console.log(arg);
};


conn.once('open',()=>{
  //writeAudio('test.wav');
  deleteAudioByKeys({length : 13501});
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



