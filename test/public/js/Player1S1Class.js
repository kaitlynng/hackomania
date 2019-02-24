class Player1S1Class extends Phaser.Scene {
  constructor() {
    super({key:"Player1S1"});
  }

  preload() {
    this.load.image('tile', 'assets/tile.png');
    this.load.image('sprite', 'assets/sprite.png');
    this.load.image('sprite2', 'assets/sprite2.png');
  }

  create() {
    //basic config
    console.log("in create");
    const {width, height} = this.sys.game.config;
    console.log("What's up");
    this.physics.world.setBounds(0, 0, width, height);
    const bg = this.add.tileSprite(0, 0, width, height, 'tile');
    bg.setOrigin(0,0);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.otherPlayers = this.add.group();
    // this.otherPlayersPos = {};

    Object.keys(playersPos).forEach((id) => {
      if (id === my_player_id) {
        this.addPlayer(id); //addPlayer adds the own character
      } else {
        this.addOtherPlayers(id); //adds other players' characters
      };
      console.log("loop");
      // this.addPlayer(id);
    });

    //camera can access whole world but with a restricted window size of 800 by 500
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.setSize(cameraWidth, cameraHeight);
    this.cameras.main.startFollow(this.player, false, 0.1, 0.1);

    //minicam aka world map
    this.minimap = this.cameras.add(200, 5, 700, 300).setZoom(0.15).setName('mini');
    // this.minimap.setBackgroundColor(0x002244);
    this.minimap.scrollX = 2000;
    this.minimap.scrollY = 800;
    // opacity: 0.1;

    this.myContainers = this.physics.add.group();
    this.other_words_dict = {};

    // this.otherContainers = this.physics.add.group({
    //   key: 'otherContainer'
    // });

    this.physics.world.enable(this.myContainers);
    this.physics.add.overlap(this.player, this.myContainers, collectWord, null, this);
    function collectWord (player, col_container) {
      //remove first container from group in other_words_dict[my_player_id]
      //BUT ONLY CAN COLLECT IN THE ORDER OF THE ARRAY
      //emits event COLLISION
      // var firstChild = this.myContainers.getFirst(true);
      var arrayCon = this.myContainers.getChildren();
      if(arrayCon[0] === col_container) {
        this.myContainers.remove(col_container);
        col_container.setVisible(false);
        this.events.emit('addScore');
        socket.emit('collision', score, my_player_id);
      };
    };

    socket.emit('debugging', "hello");
    socket.on('newWords', (words, wordsPos, player_id) => {
      if (player_id == players[my_player_id]["partner_id"]) { //players[my_player_id]['partner_id']
        for (var i = 0; i < words.length; i++) {
          var wordX = wordsPos[i][0];
          var wordY = wordsPos[i][1];
          var text = this.add.text(0, 0, words[i], {
            font: '20px Arial',
            fill: 'black'
          });
          var yes = this.add.container(wordX, wordY, [text]).setSize(80, 30);
          this.myContainers.add(yes); //this adds each new container to the myContainers group
        }
        // console.log(this.myContainers.getChildren());
      } else {
        this.other_words_dict[player_id] = this.physics.add.group();
        for (var i = 0; i < words.length; i++) {
          var wordX = wordsPos[i][0];
          var wordY = wordsPos[i][1];
          var text = this.add.text(0, 0, words[i], {
            font: '20px Arial',
            fill: 'black'
          });
          var yes = this.add.container(wordX, wordY, [text]).setSize(80, 30);
          this.other_words_dict[player_id].add(yes);
        }
      };
      this.arrayCon = this.myContainers.getChildren();
      for (var j = 0; j < this.arrayCon.length; j++) {
        var textChild = this.arrayCon[j].first;
        console.log(textChild.text);
      };
      console.log(this.other_words_dict);
    });

    socket.on('otherCollision', (player_id) => {
      console.log("In other collision");
      var other_container = this.other_words_dict[player_id];
      console.log(other_container);
      var rem_container = other_container.getChildren()[0];
      other_container.remove(rem_container);
      rem_container.setVisible(false);
    });

    socket.on("playerDisconnect", (player_id) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (player_id === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
      });
    });

    socket.on('otherPlayerMove', (id, new_pos) => {
      console.log('other player moved');
      console.log('new_pos:' + new_pos);
      console.log(id);
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (id === otherPlayer.playerId) {
          otherPlayer.x = new_pos['x'];
          otherPlayer.y = new_pos['y'];
          console.log('success!');
        }
      });

    })

      // var player_id = Object.keys(new_pos)[0];
      // this.otherPlayers[player_id] = new_pos[player_id];
    


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

    if (this.old_pos && (this.player.x !== this.old_pos['x'] || this.player.y !== this.old_pos.y)) {
      socket.emit('playerMove', {x: this.player.x, y: this.player.y});
      console.log('i moved');
    };

    this.old_pos = {
      x: this.player.x,
      y: this.player.y
    };
  };


  addOtherPlayers(player_id) {
    var playerX = playersPos[player_id]['x'];
    var playerY = playersPos[player_id]['y'];
    var otherPlayer = this.add.image(playerX, playerY, 'sprite2');
    otherPlayer.scaleX = 0.5;
    otherPlayer.scaleY = 0.5;
    otherPlayer.playerId = player_id;
    console.log('Other player:' + otherPlayer.playerId);
    this.otherPlayers.add(otherPlayer);
  }

  addPlayer(player_id) {
    var playerX = playersPos[player_id]['x'];
    var playerY = playersPos[player_id]['y'];
    this.player = this.physics.add.image(playerX, playerY, 'sprite');
    // if (player_id == my_player_id) {
    this.player.scaleX = 0.5;
    this.player.scaleY = 0.5;
    this.player.setCollideWorldBounds(true);
    this.player.onWorldBounds = true;
//    }
    // else {
    //   var otherPlayer = this.add.sprite(playerX, playerY, 'sprite2');
    //   otherPlayer.scaleX = 0.5;
    //   otherPlayer.scaleY = 0.5;
    //   this.otherPlayersPos[player_id] = {
    //     x: playerX,
    //     y: playerY
    //   }
    //   this.otherPlayers.add(otherPlayer);
    // }
  };


};


//-----!!!KAITLYN LOOK HERE!!!---spawning sprite at random locations on the world map------------
/*    var playerX = Phaser.Math.Between(20, width-20);
    var playerY = Phaser.Math.Between(20, height-20);
    this.player = this.physics.add.image(playerX, playerY, 'sprite');
    // resizing the sprite image
    this.player.scaleX = 0.5;
    this.player.scaleY = 0.5;
    this.player.setCollideWorldBounds(true);
    this.player.onWorldBounds = true;
*/

//-----!!!KAITLYN LOOK HERE!!!---splitting sentence into words and creating associated containers
/*    var sentence = prompt("Please enter some Singlish");
    this.words = sentence.split(" ");
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
