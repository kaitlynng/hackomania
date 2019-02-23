//configuration parameters of game
var config = {
  type:Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent:'phaser-game',
  scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: 0}
    }
  },
};

var game = new Phaser.Game(config);

//---------------------------------global variables-------------------------------------------------------
//scene_keys = ["Start", "Wait", "Player1", "Player2", "GameOver", "Leaderboard"];
//scene_classes = [StartClass, WaitClass, Player1Class, Player2Class, GameOverClass, LeaderboardClass];
var player_id;

scene_keys = ["Start", "Wait"];
scene_classes = [StartClass, WaitClass];
var active_scene;

var players = {};


var debugging = true;
//------------------------------------functions------------------------------------------------------------

function addScenes() {
  for(i=scene_keys.length-1; i>-1; i--) {
    console.log(i);
    game.scene.add(scene_keys[i], scene_classes[i]);
  };
  console.log("Finished adding scenes");

  active_scene = scene_keys[0];
  game.scene.start(active_scene);

}

function sceneChange(scene_key) {
  active_scene = scene_key;
  console.log("Scene change called");
  checkHTML(active_scene);
}; //function links to jquery-methods file to control html elements

//-------------------------------------sockets---------------------------------------------------------------
var socket = io.connect();


socket.on("newConnection", (data) => {
  player_id = data;
  console.log(player_id);
  addScenes();
});



/*
socket.on("message", function(data) {
  console.log(data);
});
*/
