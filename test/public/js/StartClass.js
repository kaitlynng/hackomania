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
    const {width, height} = this.sys.game.config;
    this.image = this.add.image(500, 500, "welcome");
    this.image.setInteractive();

    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.setSize(window.innerWidth, window.innerHeight);

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
      const {width, height} = this.sys.game.config;
      socket.emit("joinGame", username, width, height, (data) => {
        players = data;
        sceneChange("Wait");
        this.scene.start("Wait");
      });
    }
  }
}
