class Scene1 extends Phaser.Scene {
  constructor() {
    super({key:"Scene1"});
  }

  preload() {
    this.load.image('tile', 'assets/tile.png');
    this.load.image('sprite', 'assets/sprite.png');
    this.load.image('star', 'assets/star.png');
  }


  create() {
    // this.physics.world.setBounds(-width, -height, width*2, height*2);
    // this.game.stage.backgroundColor = '#444';
    // this.add.image(0, 0, 'map').setOrigin(0,0);
    // new TileSet('tile', 0);
    // new StaticTilemapLayer(Example1, tilemap, 0, tileset)
    // var background = this.game.add.tileSprite(-width, -height,
    //     this.game.world.width, this.game.world.height, 'tile');

    const {width, height} = this.sys.game.config;
    this.physics.world.setBounds(0, 0, width, height);
    const bg = this.add.tileSprite(0, 0, width, height, 'tile');
    bg.setOrigin(0,0);
    // var map = this.make.tilemap({key: 'map'});
    // var tileset = map.addTilesetImage('tile');
    // var staticLayer = map.createStaticLayer('background', tileset, 0, 0);

    this.cursors = this.input.keyboard.createCursorKeys();

    var playerX = Phaser.Math.Between(20, width-20);
    var playerY = Phaser.Math.Between(20, height-20);
    this.player = this.physics.add.image(playerX, playerY, 'sprite');
    this.player.scaleX = 0.05;
    this.player.scaleY = 0.05;
    this.player.setCollideWorldBounds(true);
    this.player.onWorldBounds = true;

    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.setSize(800, 500);
    // this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(this.player, false, 0.1, 0.1);
    // this.cameras.main.setBackgroundColor('#FFFFFF');

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
      frameQuantity: 30
      // setXY: { x:Phaser.Math.Between(0, 2000), y:Phaser.Math.Between(0, 2000), stepX:Phaser.Math.Between(0, 100), stepY:Phaser.Math.Between(0, 100) },
      // repeat: 11
    });
    var world = new Phaser.Geom.Rectangle(0, 0, width, height);
    Phaser.Actions.RandomRectangle(stars.getChildren(), world);

    // for (let i = 0; i < 64; i++) {
    //   let x = Phaser.Math.Between(0, 800);
    //   let y = Phaser.Math.Between(0, 600);
    //
    //   this.add.image(x, y, 'star').setInteractive();
    // }

    // var score = 0;
    // var scoreText = this.add.text(20, 20, 'Score: 0', {
    //   font: '30px Arial',
    //   fill: 'black'
    // }).setScrollFactor(0)


    this.physics.add.overlap(this.player, stars, collectStar, null, this);
    function collectStar (player, stars) {
      stars.disableBody(true, true);
      //dispatch an event for other scene to listen to
      this.events.emit('addScore');
      // score += 10;
      // scoreText.setText('Score: ' + score);
    }

  }

  update (delta) {
      this.player.setVelocity(0);

      if (this.cursors.left.isDown){
          this.player.setVelocityX(-500);
      }
      else if (this.cursors.right.isDown){
          this.player.setVelocityX(500);
      }
      if (this.cursors.up.isDown){
          this.player.setVelocityY(-500);
      }
      else if (this.cursors.down.isDown){
          this.player.setVelocityY(500);
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
