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
    console.log("In Wait Class");
    console.log("My attributes: ", player_attrb);
    socket.on("newPlayer", (data) => {
      console.log("New player: ", data);
    });
  }

  update(delta) {

  }

}
