class Example1 extends Phaser.Scene {
  //constructor is called when the class is created
  constructor() {
    super({key:"Example1"}); //this class will be referred by "Example1"
    self = this; //handle 'this' in callbacks
  } //called when the class is created

  //load assets
  preload() {
    self.load.image("sprite", "../assets/sprite_down.png"); //"sprite" is the key of the image
  }

  create() {
    self.socket = io(); //establish client socket
    self.otherPlayers = self.add.group(); //a group is a container of game objects affected in the same way

    //receives socket message if it establishes a new connection
    self.socket.on("currentPlayers", (players) => {
      Object.keys(players).forEach( (id) => { //iterates through an array of keys in players (which is a dictionary)
        if (players[id].playerId === self.socket.id) {
          self.addPlayer(players[id]); //addPlayer adds the own character
        } else {
          self.addOtherPlayers(players[id]); //adds other players' characters
        };
      });
    });

    //receives socket message if new player joins the game
    self.socket.on("newPlayer", (playerInfo) => {
      self.addOtherPlayers(playerInfo);
    });

    //receives socket message if a player disconnects from the game
    self.socket.on("playerDisconnect", (playerId) => {
      self.otherPlayers.getChildren().forEach((otherPlayer) => { //getChildren returns array of game objects in the group
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
      });
    });

    self.socket.on("otherPlayerMoved", (playerInfo) => {
      self.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.x = playerInfo.x;
          otherPlayer.y = playerInfo.y;
        }
      });
    });

    //create pointer object to store state of the mouse pointer
    self.pointer = self.input.activePointer;
  }

  update(delta) {
    if(self.image) {
      //always move the image towards the pointer position
      self.image.x += (self.pointer.x - self.image.x) * self.image.vx;
      self.image.y += (self.pointer.y - self.image.y) * self.image.vy;

      //update position to sockets if character moved
      if (self.image.oldPosition && (self.image.x !== self.image.oldPosition.x || self.image.y !== self.image.oldPosition.y)) {
        self.socket.emit('playerMove', {x: self.image.x, y: self.image.y});
      }
      self.image.oldPosition = {
        x: self.image.x,
        y: self.image.y
      };
    };
  }

  addPlayer(playerInfo) {
    self.image = self.add.image(playerInfo.x, playerInfo.y, "sprite").setOrigin(0.5, 0.5); //setOrigin sets the image to rotate about its center
    self.image.vx = playerInfo.vx;
    self.image.vy = playerInfo.vy;
  }

  addOtherPlayers(playerInfo) {
    const otherPlayer = self.add.image(playerInfo.x, playerInfo.y, "sprite").setOrigin(0.5, 0.5);
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer); //add otehrPlayer game object to otherPlayers group
  }
}
