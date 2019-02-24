//configuration parameters of game
var config = {
  type:Phaser.AUTO,
  width: 2000,
  height: 1000,
  parent:'phaser-game',
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: 0}
    }
  },
};

var game = new Phaser.Game(config);

//---------------------------------global variables-------------------------------------------------------
//scene_keys = ["Start", "Wait", "Player1S1", "Player1S2", "Player2", "GameOver", "Leaderboard"];
//scene_classes = [StartClass, WaitClass, Player1Class, Player2Class, GameOverClass, LeaderboardClass];
var my_player_id;

var cameraWidth = window.innerWidth;
var cameraHeight = window.innerHeight;

scene_keys = ["Start", "Wait", "Player1S2", "Player1S1", "Player2", "LeaderboardScene"];
scene_classes = [StartClass, WaitClass, Player1S2Class, Player1S1Class, Player2Class, LeaderboardScene];
var active_scene;

var players = {};
var playersPos = {};
var score = 0;


var record_event = false;
var mediaRecorder;
var audioChunks = [];
var audioBlob;
var audioBuffer;

var audioNumber;

var audio_received = [];
var audioPrompts = ['Order your favorite meal at the hawker centre',
'Break up with your girlfriend','Call the police about teenagers making noise at 11pm',
'What is your hobby?','What do you work as?', 'Invite your friend over for dinner',
'Act out a situation in the wet market, where you bargain for vegetables',
'Approach a school boy who does not give up his seat for a preganant woman',
'Talk about your last holiday'];

var sendAudioReader = new FileReader();
sendAudioReader.onload = (event) => {
  console.log("Entered filereader");
  arrayBuffer = event.target.result;
  console.log("Array buffer: ", arrayBuffer);
  socket.emit("sendAudio", arrayBuffer);
};

var debugging = true;
//------------------------------------functions------------------------------------------------------------

function addScenes() {
  for(i=scene_keys.length-1; i>-1; i--) {
    console.log(i);
    game.scene.add(scene_keys[i], scene_classes[i]);
  };
  console.log("Finished adding scenes");

  active_scene = scene_keys[0];
  sceneChange(active_scene);
  game.scene.start(active_scene);
}

function sceneChange(scene_key) {
  active_scene = scene_key;
  console.log("Scene change called");
  checkHTML(active_scene);
}; //function links to jquery-methods file to control html elements

//audio functions
var handleAudioSuccess = function(stream) {
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();
  console.log("Media Device started");

  mediaRecorder.addEventListener("dataavailable", (event) => {
    audioChunks.push(event.data);
  });

  mediaRecorder.addEventListener("stop", () => {
    audioBlob = new Blob(audioChunks);
    const audioUrl = URL.createObjectURL(audioBlob);
    reloadPlayer(audioUrl);
    audioChunks = [];
  });
};

function sendAudio() {
  sendAudioReader.readAsArrayBuffer(audioBlob);
}

function getAudio(index){
  const audioBlobP2 = new Blob([audio_received[index][0]]);
  const audioUrlP2 = URL.createObjectURL(audioBlobP2);
  const audioP2 = new Audio(audioUrlP2);
  return [audioP2,audio_received[0][1]];
}

//-------------------------------------sockets---------------------------------------------------------------
var socket = io.connect();

socket.on("newConnection", (data) => {
  my_player_id = data;
  console.log(my_player_id);
  addScenes();
});



/*
socket.on("message", function(data) {
  console.log(data);
});
*/
