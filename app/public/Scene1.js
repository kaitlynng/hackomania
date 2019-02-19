class Scene1 extends Phaser.Scene {
  constructor() {
    super({key:"Scene1"});
  }

  preload() {
    this.load.image('map', 'assets/map.png');
    this.load.image('sprite', 'assets/sprite.png');
    this.load.image('star', 'assets/star.png');
  }

  create() {
    this.physics.world.setBounds(0, 0, 1024, 512);
    this.add.image(0, 0, 'map').setOrigin(0,0);
    var score = 0;
    var scoreText = this.add.text(270,140,'Score: 0', { fontSize: '15px', fill: '#000' }).setScrollFactor(0);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = this.physics.add.image(512, 256, 'sprite');
    this.player.scaleX = 0.05;
    this.player.scaleY = 0.05;
    this.player.setCollideWorldBounds(true);
    this.player.onWorldBounds = true;

    this.cameras.main.setBounds(0, 0, 1024, 516);
    this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(this.player, 0.5, 0.5);
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // var moveCam = false;
    // this.cameras.main.setDeadzone(200, 150);
    // if (this.cameras.main.deadzone)
    // {
    //   var graphics = this.add.graphics().setScrollFactor(0);
    //   // graphics.lineStyle(2, 0x00ff00, 1);
    //   graphics.strokeRect(512, 256, this.cameras.main.deadzone.width, this.cameras.main.deadzone.height);
    // }

    var stars = this.physics.add.group({
      key: 'star',
      frameQuantity: 20
      // setXY: { x:Phaser.Math.Between(0, 2000), y:Phaser.Math.Between(0, 2000), stepX:Phaser.Math.Between(0, 100), stepY:Phaser.Math.Between(0, 100) },
      // repeat: 11
    });
    var world = new Phaser.Geom.Rectangle(0, 0, 1024, 512);
    Phaser.Actions.RandomRectangle(stars.getChildren(), world);

    this.physics.add.overlap(this.player, stars, collectStar, null, this);
    function collectStar (player, stars) {
      stars.disableBody(true, true);
      score += 10;
      scoreText.setText('Score: ' + score);
    }

  }

  update () {
      // var cam = this.cameras.main;

      this.player.setVelocity(0);

      if (this.cursors.left.isDown){
          this.player.setVelocityX(-200);
      }
      else if (this.cursors.right.isDown){
          this.player.setVelocityX(200);
      }
      if (this.cursors.up.isDown){
          this.player.setVelocityY(-200);
      }
      else if (this.cursors.down.isDown){
          this.player.setVelocityY(200);
      }
  }

}

//
// var player;
// var cursors;
//
// function create ()
// {
//     //  Set the camera and physics bounds to be the size of 4x4 bg images
//     this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);
//     this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2);
//
//     //  Mash 4 images together to create our background
//     this.add.image(0, 0, 'bg').setOrigin(0);
//     this.add.image(1920, 0, 'bg').setOrigin(0).setFlipX(true);
//     this.add.image(0, 1080, 'bg').setOrigin(0).setFlipY(true);
//     this.add.image(1920, 1080, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);
//
//     cursors = this.input.keyboard.createCursorKeys();
//
//     player = this.physics.add.image(500, 500, 'sprite');
//
//     player.setCollideWorldBounds(true);
//
//     this.cameras.main.startFollow(player, true, 0.05, 0.05);
// }
//
