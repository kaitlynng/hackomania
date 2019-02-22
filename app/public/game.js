var config = {
    type: Phaser.AUTO,
    width:2000,
    height:1000,
    physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: 0}
        }
    },
    scene: [Scene1, FixedToCamera]
};

var game = new Phaser.Game(config);
