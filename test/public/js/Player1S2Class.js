class Player1S2Class extends Phaser.Scene {
  constructor() {
    super({key:"Player1S2"});
  }

  // preload() {
  // 	this.load.html("leaderboard", "assets/leaderboard.html",50,50);
  // }
  preload() {
    this.load.image('testImage','assets/test4.jpg');
    this.load.audio('testAudio1','assets/audiofiles/SampleAudio_0.4mb.mp3');
  }

  create() {
    console.log('lol');
    this.cameras.main.setBounds(0, 0, window.innerWidth, window.innerHeight);
    var scoreText = this.add.text(50, 50, 'Score: 0', {
      font: '30px Arial',
      fill: 'black',
    }).setScrollFactor(0)

// // testing scoreboard formats
//     var scoreText = this.add.text(700, 50, 'leaderboard', {
//       font: '30px Arial',
//       fill: 'black'
//     }).setScrollFactor(0)
// // thats it



    // this.leaderboard = this.add.image(700, 50, 'leaderboard');
    audioNumber = 0;
    let ourGame = this.scene.get('Player1S1');
    ourGame.events.on('addScore', () => {
      score += 10;
      scoreText.setText('Score: ' + score);
    });
    this.music = getAudio(audioNumber)[0];
    this.image = this.add.sprite(400,525,'testImage').setInteractive();
    this.input.setDraggable(this.image);
    this.input.on('drag',(pointer,gameObject,dragX)=>{
      var maxX = 600;
      var minX = 300;
      gameObject.x = Math.min(maxX, Math.max(minX,dragX));
      var percentage = (gameObject.x - minX)/(maxX - minX);
      this.music.setSeek(this.music.duration* percentage);
    });

    var playBox = this.add.graphics();
    playBox.fillStyle(0xffffff, 0.8);
    playBox.fillRect(300,525,300,2);

    this.play = 0;
    this.playButton = this.add.text(30,520,"play audio",{fill:'#006400'}).setInteractive();
    this.playButton.on('pointerdown',()=>{
      console.log('mdasjaskd');
      if(this.music.seek == 0){
        this.music.play();
        this.play = 1;
      }
      else{
        this.music.play();
        this.play = 1;
      };
    });


    this.input.keyboard.on('keydown-SPACE', (event)=> {
      if (this.play == 0) {
        this.music.play();
        this.play = 1; //playing
      }
      else if (this.play == 1){
        this.music.pause();
        this.play = 2; // paused
      }
      else if (this.play == 2){
        this.music.play();
        this.play = 1;
      }
    });


      this.pauseButton = this.add.text(150,520,"pause audio",{fill:'#006400'}).setInteractive();
      this.pauseButton.on('pointerdown',()=>{
        this.music.pause();
        this.play = 2;
  //			console.log(this.music.seek);
      })


      this.i = 0;

      socket.on('EndGame',() => {
        this.scene.stop();
      });

      socket.on('loadAudio',(audiofile_get, audioID_get) => {
        audio_received.push([audiofile_get, audioID_get]);
        console.log(audio_received);
      });


  }

  update() {
    var playPercent = this.music.seek / this.music.duration;
    this.image.x = 300 + 300*playPercent;

    this.i += 1;
    if(this.i == 50){
      this.i = 0;
    }

    if (this.music.seek>this.music.duration){
      this.music.stop();
    };

  }

};
