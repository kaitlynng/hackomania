class Player1S1Class extends Phaser.Scene {
  constructor() {
    super({key:"Player1S1"});
  }

  preload() {
    this.load.image('tile', 'assets/tile.png');
    this.load.image('sprite', 'assets/sprite.png');
  }

  create() {
    //basic config
    console.log("in create");
    const {width, height} = this.sys.game.config;
    console.log("What's up");
    this.physics.world.setBounds(0, 0, width, height);
    const bg = this.add.tileSprite(0, 0, width, height, 'tile');
    bg.setOrigin(0,0);

    //keyboard arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.otherPlayers = this.physics.add.group();

    console.log("PlayersPos", playersPos);

    Object.keys(playersPos).forEach((id) => {
      console.log("loop");
      this.addPlayer(id);
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.otherPlayers = this.physics.add.group();

    Object.keys(playersPos).forEach((id) => {
      this.addPlayer(id);
    });

//-----!!!KAITLYN LOOK HERE!!!---spawning sprite at random locations on the world map------------
/*    var playerX = Phaser.Math.Between(20, width-20);
    var playerY = Phaser.Math.Between(20, height-20);
    self.player = self.physics.add.image(playerX, playerY, 'sprite');
    // resizing the sprite image
    self.player.scaleX = 0.5;
    self.player.scaleY = 0.5;
    self.player.setCollideWorldBounds(true);
    self.player.onWorldBounds = true;
*/

    //camera can access whole world but with a restricted window size of 800 by 500
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.setSize(camera_width, camera_height);
    this.cameras.main.startFollow(this.player, false, 0.1, 0.1);

    //minicam aka world map
    this.minimap = this.cameras.add(200, 5, 700, 300).setZoom(0.15).setName('mini');
    // this.minimap.setBackgroundColor(0x002244);
    this.minimap.scrollX = 2000;
    this.minimap.scrollY = 800;
    // opacity: 0.1;

//-----!!!KAITLYN LOOK HERE!!!---splitting sentence into words and creating associated containers
    var sentence = prompt("Please enter some Singlish");
    this.words = sentence.split(" ");
/*    var sentence = prompt("Please enter some Singlish");
    self.words = sentence.split(" ");
>>>>>>> 295ccb8cf57845a98e5827b004ba58c571ed2729

    //containers group
    this.containers = this.physics.add.group({
      key: 'container'
    });

    //array to store the positions of all the words
    this.coords = [];

    //function for storing array of x&y coords in the array this.coords
    function storeCoordinate(xVal, yVal, array) {
      array.push({x: xVal, y: yVal});
    }

    //spawning all the words and associated containers at random locations
    for (var i = 0; i < this.words.length; i++) {
      var wordX = Phaser.Math.Between(50, width-50);
      var wordY = Phaser.Math.Between(50, height-50);
      storeCoordinate(wordX, wordY, this.coords);

      var text = this.add.text(0, 0, this.words[i], {
        font: '20px Arial',
        fill: 'black'
      });

      var yes = this.add.container(wordX, wordY, [text]).setSize(80, 30);
      this.containers.add(yes); //this adds each new container to the container group
    }
*/

    //okay this is player 1 logic dunnid put in server already
    this.physics.world.enable(this.containers);

    this.physics.add.overlap(this.player, this.containers, collectWord, null, this);
    function collectWord (player, container) {
      console.log('firing');
      this.containers.remove(container);
      container.setVisible(false);
      this.events.emit('addScore');
    };

    self.myContainers = self.physics.add.group({
      key: 'myContainer'
    });

    self.otherContainers = self.physics.add.group({
      key: 'otherContainer'
    });

  };

  update(delta) {
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

<<<<<<< HEAD
      };
=======
      // var gameObjects = this.containers.getChildren();
      // console.log(gameObjects);

      io.socket.on('WordsForMe', ((words, wordsPos, partner_id) => {
        if (partner_id == players[my_player_id]['partner_id']) {
          for (var i = 0; i < words.length; i++) {
            var wordX = wordsPos[i][0];
            var wordY = wordsPos[i][1];
            var text = self.add.text(0, 0, words[i], {
              font: '20px Arial',
              fill: 'black'
            });
            var yes = self.add.container(wordX, wordY, [text]).setSize(80, 30);
            self.myContainers.add(yes) //this adds each new container to the myContainers group
          }
        }

        else {
          //TO THINK
        }

      }

  }

  addPlayer(player_id) {
    var playerX = playersPos[player_id]['x'];
    var playerY = playersPos[player_id]['y'];
    if (player_id == my_player_id) {
      this.player = this.physics.add.image(playerX, playerY, 'sprite');
      this.player.scaleX = 0.5;
      this.player.scaleY = 0.5;
      this.player.setCollideWorldBounds(true);
      this.player.onWorldBounds = true;
    }
    else {
      var otherPlayer = this.add.sprite(playerX, playerY, 'sprite');
      otherPlayer.scaleX = 0.5;
      otherPlayer.scaleY = 0.5;
      otherPlayer.setTint(0x0000ff);
      this.otherPlayers.add(otherPlayer);
    }
  };
>>>>>>> 513208ea1ed4fd1ccf06e31751eac6d4b307c0fd

// receiving words that are correct and wrong
<<<<<<< HEAD
/*
io.socket.on('incomingwords', function() {
  for (var i = 0; i < self.words.length; i++) {
    var wordX = Phaser.Math.Between(50, width-50);
    var wordY = Phaser.Math.Between(50, height-50);
    storeCoordinate(wordX, wordY, self.coords);
}
*/
=======


>>>>>>> 295ccb8cf57845a98e5827b004ba58c571ed2729

};
