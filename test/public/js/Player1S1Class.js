class Player1S1Class extends Phaser.Scene {
  constructor() {
    super({key:"Player1S1"});
    self = this;
  }

  preload() {
    self.load.image('tile', 'assets/tile.png');
    self.load.image('sprite', 'assets/sprite.png');
  }

  create() {
    //basic config
    const {width, height} = self.sys.game.config;
    self.physics.world.setBounds(0, 0, width, height);
    const bg = self.add.tileSprite(0, 0, width, height, 'tile');
    bg.setOrigin(0,0);

    //keyboard arrow keys
    self.cursors = self.input.keyboard.createCursorKeys();

    //sockets

    Object.keys(playersPos).forEach((id) => {
      self.addPlayer(self, id);
    });

//-----!!!KAITLYN LOOK HERE!!!---spawning sprite at random locations on the world map------------
    var playerX = Phaser.Math.Between(20, width-20);
    var playerY = Phaser.Math.Between(20, height-20);
    self.player = self.physics.add.image(playerX, playerY, 'sprite');
    // resizing the sprite image
    self.player.scaleX = 0.07;
    self.player.scaleY = 0.07;
    self.player.setCollideWorldBounds(true);
    self.player.onWorldBounds = true;

    //camera can access whole world but with a restricted window size of 800 by 500
    self.cameras.main.setBounds(0, 0, width, height);
    self.cameras.main.setSize(800, 500);
    self.cameras.main.startFollow(self.player, false, 0.1, 0.1);

    //  The miniCam is 400px wide, so can display the whole world at a zoom of 0.1

    self.minimap = this.cameras.add(200, 5, 700, 300).setZoom(0.15).setName('mini');
    // self.minimap.setBackgroundColor(0x002244);
    self.minimap.scrollX = 2000;
    self.minimap.scrollY = 800;
    // opacity: 0.1;

//-----!!!KAITLYN LOOK HERE!!!---splitting sentence into words and creating associated containers
    var sentence = prompt("Please enter some Singlish");
    self.words = sentence.split(" ");

    //containers group
    self.containers = this.physics.add.group({
      key: 'container'
    });

    //array to store the positions of all the words
    self.coords = [];

    //function for storing array of x&y coords in the array self.coords
    function storeCoordinate(xVal, yVal, array) {
      array.push({x: xVal, y: yVal});
    }

    //spawning all the words and associated containers at random locations
    for (var i = 0; i < self.words.length; i++) {
      var wordX = Phaser.Math.Between(50, width-50);
      var wordY = Phaser.Math.Between(50, height-50);
      storeCoordinate(wordX, wordY, self.coords);

      var text = self.add.text(0, 0, self.words[i], {
        font: '20px Arial',
        fill: 'black'
      });

      var yes = self.add.container(wordX, wordY, [text]).setSize(80, 30);
      self.containers.add(yes) //this adds each new container to the container group
    }

    //okay this is player 1 logic dunnid put in server already
    self.physics.world.enable(self.containers);

    self.physics.add.overlap(self.player, self.containers, collectWord, null, this);
    function collectWord (player, container) {
      console.log('firing');
      self.containers.remove(container);
      container.setVisible(false);
      self.events.emit('addScore');
    }

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

      // var gameObjects = self.containers.getChildren();
      // console.log(gameObjects);

  }

  addPlayer(self, player_id) {
    var playerX = playersPos[player_id][x];
    var playerY = playersPos[player_id][y];
    if (player_id == my_player_id) {
      self.player = self.physics.add.image(playerX, playerY, 'sprite');
    }
    else {
      console.log("dunno");
    }
  }

};
