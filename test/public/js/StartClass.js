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
      var username = document.getElementById("text-field").value;
      username = ((username == null) ? "" : username);
      this.enterGame(username);
    });

  }

  update(delta) {

  }

  enterGame(username) {
    socket.emit("joinGame", username, (data) => {
      players = data;
      sceneChange("Wait");
      this.scene.start("Wait");
    });
  }

}
