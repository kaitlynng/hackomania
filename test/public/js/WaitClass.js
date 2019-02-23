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
      this.startGame(players[my_player_id]["player_type"]);
    });

    if(debugging) {
      console.log("My id: ", my_player_id);
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

    socket.on("startGame", (players, playersPos, audiofile,audioID) => {
      this.startGame(players, playersPos, audiofile,audioID);
    });
  }

  update(delta) {
  }

  startGame(players_get, playersPos_get, audiofile_get,auidoID_get) {
    players = players_get;
    playersPos = playersPos_get;
    audio_received.push([audiofile_get,audioID_get]);
    console.log("Players: ", players);
    console.log("PlayersPos: ", playersPos);
    console.log("Audiofile: ", audiofile_get);

    if(players[my_player_id]["player_type"] == 1) {
      sceneChange("Player1S1");
      this.scene.start("Player1S2");
      this.scene.start("Player1S1");
    } else if (players[my_player_id]["player_type"] == 2) {
      sceneChange("Player2");
      this.scene.start("Player2");
    };
  };

}
