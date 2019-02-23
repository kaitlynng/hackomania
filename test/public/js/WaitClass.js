class WaitClass extends Phaser.Scene {
  //constructor is called when the class is created
  constructor() {
    super({key:"Wait"}); //this class will be referred by "Example1"
  } //called when the class is created

  //load assets
  preload() {
    this.load.image("rainbow", "../assets/rainbow_test.png");
  }

  create() {

    this.image = this.add.image(game.config.width/2, game.config.height/2, "rainbow");
    this.image.setInteractive();
    this.image.on('pointerdown', () => {
      this.startGame(players[player_id].player_type);
    });

    if(debugging) {
      console.log("My id: ", player_id);
      console.log("All players: ", players);
    };

    socket.on("newPlayer", (data) => {
      players[data.player_id] = data;
      console.log("New player: ", players[data.player_id]);
    });
    socket.on("playerDisconnect", (id) => {
      Object.keys(players).forEach((player_id) => {
        if(id === player_id) {
          delete(players[player_id]);
        };
      });
      console.log("Player ", id, " disconnected");
      console.log("Remaining players: ", players);
    });

    socket.on("startGame", (players, playersPos) => {
      startGame(players, playersPos);
    }
  }

  update(delta) {
  }

  startGame(players, playersPos) {
    players = players;
    playersPos = playersPos;
    console.log(players, playersPos);
    Object.keys(players).forEach((id) => {
      if(players[id][player.type] == 1) {
        sceneChange("Player1S1Class");
        this.scene.start("Player1S1Class");
        this.scene.start("Player1S2Class");
      };
      else if(players[id][player.type] == 2) {
        sceneChange("Player2Class");
        this.scene.start("Player2Class");
      };
    })
  }
}
