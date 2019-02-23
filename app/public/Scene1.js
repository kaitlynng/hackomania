class Scene1 extends Phaser.Scene {
  constructor() {
    super({key:"Scene1"});
    self = this;
  }

  preload() {
    self.load.image('tile', 'assets/tile.png');
    self.load.image('sprite', 'assets/sprite.png');
    self.load.image('star', 'assets/star.png');
    self.load.image('textbox', 'assets/textbox.png');
  }


  create() {

    const {width, height} = self.sys.game.config;
    self.physics.world.setBounds(0, 0, width, height);
    const bg = self.add.tileSprite(0, 0, width, height, 'tile');
    bg.setOrigin(0,0);

    self.cursors = self.input.keyboard.createCursorKeys();

    var playerX = Phaser.Math.Between(20, width-20);
    var playerY = Phaser.Math.Between(20, height-20);
    self.player = self.physics.add.image(playerX, playerY, 'sprite');
    self.player.scaleX = 0.1;
    self.player.scaleY = 0.1;
    self.player.setCollideWorldBounds(true);
    self.player.onWorldBounds = true;

    self.cameras.main.setBounds(0, 0, width, height);
    self.cameras.main.setSize(800, 500);
    self.cameras.main.startFollow(self.player, false, 0.1, 0.1);

    self.text = self.add.text(0,0,'hellotesting', {fill:'black'});
    self.container = self.add.container(300, 300, [self.text]).setSize(50, 50);

    self.physics.add.overlap(self.player, self.container, collectWord);
    function collectWord (player, container) {
      console.log('firing');
      container.disableBody(true,true);
      self.events.emit('addScore');
    }


    var text = self.add.text(0, 0, "MyText", { font: 'bold 20px Arial', fill: "black", align: 'center' });
    // text.anchor.setTo(0.5);text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    var textSprite = this.add.sprite(500, 500, null);
    textSprite.addChild(text);
    this.physics.enable(textSprite, Phaser.Physics.ARCADE);


  };

  update(delta) {
      self.player.setVelocity(0);

      if (self.cursors.left.isDown){
          self.player.setVelocityX(-500);
      }
      else if (self.cursors.right.isDown){
          self.player.setVelocityX(500);
      }
      if (self.cursors.up.isDown){
          self.player.setVelocityY(-500);
      }
      else if (self.cursors.down.isDown){
          self.player.setVelocityY(500);
      }
  }

};
