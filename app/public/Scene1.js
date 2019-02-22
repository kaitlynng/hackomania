class Scene1 extends Phaser.Scene {
  constructor() {
    super({key:"Scene1"});
    self = this;
  }

  preload() {
    self.load.image('tile', 'assets/tile.png');
    self.load.image('sprite', 'assets/sprite.png');
    self.load.image('star', 'assets/star.png');
  }


  create() {

    const {width, height} = self.sys.game.config;
    self.physics.world.setBounds(0, 0, width, height);
    const bg = self.add.tileSprite(0, 0, width, height, 'tile');
    bg.setOrigin(0,0);

    // self.cursors = self.input.keyboard.createCursorKeys();

    var playerX = Phaser.Math.Between(20, width-20);
    var playerY = Phaser.Math.Between(20, height-20);
    self.player = self.physics.add.image(playerX, playerY, 'sprite');
    self.player.scaleX = 0.05;
    self.player.scaleY = 0.05;
    self.player.setCollideWorldBounds(true);
    self.player.onWorldBounds = true;

    self.cameras.main.setBounds(0, 0, width, height);
    self.cameras.main.setSize(800, 500);
    self.cameras.main.startFollow(self.player, false, 0.1, 0.1);

    var stars = self.physics.add.group({
      key: 'star',
      frameQuantity: 30
    });
    var world = new Phaser.Geom.Rectangle(0, 0, width, height);
    Phaser.Actions.RandomRectangle(stars.getChildren(), world);

    self.physics.add.overlap(self.player, stars, collectStar, null, this);
    function collectStar (player, stars) {
      stars.disableBody(true, true);
      self.events.emit('addScore');
    }

    var sentence = prompt("Please enter some Singlish");
    self.words = sentence.split(" ");
    for (var i = 0; i < self.words.length; i++) {
      var wordX = Phaser.Math.Between(20, width-20);
      var wordY = Phaser.Math.Between(20, height-20);

      self.add.text(wordX, wordY, self.words[i], {
        font: '20px Arial',
        fill: 'black'
      });
    };

    // self.words = self.physics.add.staticGroup();
    //
    // var world = new Phaser.Geom.Rectangle(0, 0, width, height);
    // Phaser.Actions.RandomRectangle(self.words.getChildren(), world);
    //
    // self.physics.add.overlap(self.player, self.words, collectWord, null, self);
    // function collectWord (player, words) {
    //   self.words.disableBody(true, true);
    //   self.events.emit('addScore');
    // }

  };

  update() {

    var SPEED = 100;
    var ROTATION_SPEED = Math.PI; // 90 deg/s
    var ROTATION_SPEED_DEGREES = Phaser.Math.RadToDeg(ROTATION_SPEED);
    var TOLERANCE = 0.01 * ROTATION_SPEED;

    var velocityFromRotation = Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation;
    var sin = Math.sin;
    var cos = Math.cos;
    var atan2 = Math.atan2;

    pointerMove(self.input.activePointer)
    velocityFromRotation(self.player.rotation, SPEED, self.player.body.velocity);
    function pointerMove (pointer) {
      var angleToPointer = Phaser.Math.Angle.BetweenPoints(self.player, pointer);
      var angleDelta = angleToPointer - self.player.rotation;

      angleDelta = atan2(sin(angleDelta), cos(angleDelta));

      if (Phaser.Math.Within(angleDelta, 0, TOLERANCE)) {
        self.player.rotation = angleToPointer;
        self.player.setAngularVelocity(0);
      } else {
        self.player.setAngularVelocity(Math.sign(angleDelta) * ROTATION_SPEED_DEGREES);
      }
    };

      // self.player.setVelocity(0);
      //
      // if (self.cursors.left.isDown){
      //     self.player.setVelocityX(-500);
      // }
      // else if (self.cursors.right.isDown){
      //     self.player.setVelocityX(500);
      // }
      // if (self.cursors.up.isDown){
      //     self.player.setVelocityY(-500);
      // }
      // else if (self.cursors.down.isDown){
      //     self.player.setVelocityY(500);
      // }
  }

};
