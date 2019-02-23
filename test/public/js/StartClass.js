class StartClass extends Phaser.Scene {
  //constructor is called when the class is created
  constructor() {
    super({key:"Start"}); //this class will be referred by "Example1"
  } //called when the class is created

  //load assets
  preload() {
    this.load.image("welcome", "../assets/welcome.png");
  }

  create() {
    this.image = this.add.image(game.config.width/2, game.config.height/2, "welcome");
    this.image.setInteractive();

    //Entering game
    this.image.on('pointerdown', () => {
      var username = document.getElementById("username").value;
      username = ((username == null) ? "" : username);
      this.enterGame(username);
    });
  }

  update(delta) {

  }

  enterGame(username) {
    if(username=="") {
      alert("Please enter a username!");
    } else if (username!="" && audioBlob == null){
      alert("Please record some Singlish!");
    } else {
      sendAudio();
      const {width, height} = self.sys.game.config;
      socket.emit("joinGame", username, width, height, (data) => {
        players = data;
        sceneChange("Wait");
        this.scene.start("Wait");
      });
    }
  }
}
