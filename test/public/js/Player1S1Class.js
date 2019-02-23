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

    //camera can access whole world but with a restricted window size of 800 by 500
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.setSize(800, 500);
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

    //okay this is player 1 logic dunnid put in server already
    this.physics.world.enable(this.containers);

    this.physics.add.overlap(this.player, this.containers, collectWord, null, this);
    function collectWord (player, container) {
      console.log('firing');
      this.containers.remove(container);
      container.setVisible(false);
      this.events.emit('addScore');
    }

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

      // var gameObjects = this.containers.getChildren();
      // console.log(gameObjects);

  }

  addPlayer(player_id) {
    console.log("In add player");
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

};
