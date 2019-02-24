class WaitClass extends Phaser.Scene {
  //constructor is called when the class is created
  constructor() {
    super({key:"Wait"}); //this class will be referred by "Example1"
  } //called when the class is created


  //load assets
  preload() {
    this.load.image("welcome", "../assets/welcome.png");
    this.load.image("start-background", "../assets/jiazua-background.png");
  }


  create() {
    const {width, height} = this.sys.game.config;
    this.background = this.add.image(0, 0, "start-background").setOrigin(0, 0);
    this.image = this.add.image(640, 300, "welcome");
    this.image.setInteractive();
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.setSize(cameraWidth, cameraHeight);

    // this.image = this.add.image(600, 350, "rainbow");
    // this.image.setInteractive();
    // const {width, height} = this.sys.game.config;
    //
    // this.cameras.main.setBounds(0, 0, width, height);
    // this.cameras.main.setSize(cameraWidth, cameraHeight);

    this.image.on('pointerdown', () => {
      this.startGame(players[my_player_id]["player_type"]);
    });

    this.add.text(490,470, "Waiting for other players...",{fill:'#10B5E2'});

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
      this.startGame(players, playersPos, audiofile, audioID);
    });
  }


//



//
  update(delta) {
  }

  startGame(players_get, playersPos_get, audiofile_get,audioID_get) {
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
