var config = {
    type: Phaser.AUTO,
    width:1024,
    height:512,
    physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: 0}
        }
    },
    scene: [Scene1]
};

var game = new Phaser.Game(config);
