class FixedToCamera extends Phaser.Scene {
  constructor() {
    super({key:"FixedToCamera", active: true});
  }


  // preload() {
  // 	this.load.html("leaderboard", "assets/leaderboard.html",50,50);
  // }

  create() {
    this.cameras.main.setBounds(0, 0, 800, 500);

    var score = 0;
    var scoreText = this.add.text(50, 50, 'Score: 0', {
      font: '30px Arial',
      fill: 'black'
    }).setScrollFactor(0)

// // testing scoreboard formats
//     var scoreText = this.add.text(700, 50, 'leaderboard', {
//       font: '30px Arial',
//       fill: 'black'
//     }).setScrollFactor(0)
// // thats it



    // this.leaderboard = this.add.image(700, 50, 'leaderboard');

    let ourGame = this.scene.get('Scene1');
    ourGame.events.on('addScore', function() {
      score += 10;
      scoreText.setText('Score: ' + score);
    });

  }

  update() {

  }

};
