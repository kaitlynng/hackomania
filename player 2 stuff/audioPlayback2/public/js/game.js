//configuration parameters of game
var config = {
  type:Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-game',
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
  scene: [Example1] //serves the relevant scenes, which are different screens
};

var game = new Phaser.Game(config);

/*
socket.on("message", function(data) {
  console.log(data);
});
*/
