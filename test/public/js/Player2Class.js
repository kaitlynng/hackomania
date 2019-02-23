class Player2Class extends Phaser.Scene {
	constructor(){
		super({key:"Player2"});
	}

	preload(){
		this.load.image('testImage','assets/test4.jpg');
		this.load.audio('testAudio1','assets/audiofiles/SampleAudio_0.4mb.mp3');
		this.load.audio('testAudio2','assets/audiofiles/2.mp3');
		this.load.audio('testAudio3','assets/audiofiles/3.mp3');
	}

	create(){
		const {width, height} = this.sys.game.config;
		this.cameras.main.setBounds(0, 0, width, height);
		this.cameras.main.setSize(camera_width, camera_height);
		
		this.audioNumber = 1;
		this.image = this.add.sprite(400,100,'testImage').setInteractive();
		this.music = getAudio()[0];
		this.input.setDraggable(this.image);
		this.input.on('drag',(pointer,gameObject,dragX)=>{
			var maxX = 600;
			var minX = 300;
			gameObject.x = Math.min(maxX, Math.max(minX,dragX));
			var percentage = (gameObject.x - minX)/(maxX - minX);
			this.music.setSeek(this.music.duration* percentage);
//			console.log(this.music.seek);
		});

		/*
		this.input.on('dragend',(pointer,gameObject)=>{
			var maxX = 600;
			var minX = 300;
			var percentage = (gameObject.x-minX)/(maxX-minX);
			this.music.setSeek(this.music.duration*percentage);
		})
		*/

		var playBox = this.add.graphics();
		playBox.fillStyle(0xffffff, 0.8);
		playBox.fillRect(300,100,300,2);

		this.play = 0;
		this.playButton = this.add.text(50,50,"play audio",{fill:'#0f0'}).setInteractive();
		this.playButton.on('pointerdown',()=>{
			if(this.music.seek == 0){
				this.music.play();
				this.play = 1;
			}
			else{
				this.music.play();
				this.play = 1;
			};
		});

		// space bar pause and play
		this.input.keyboard.on('keydown-SPACE', (event) => {
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
			console.log('Hello from the A Key!');
		});


		this.enter = this.add.text(660,340,"Enter", {fill:'#0f0'}).setInteractive();
		this.enter.on('pointerdown', () => {
			var transcription = document.getElementById("transcription").value;
			console.log(transcription); // SOCKETS!! send transcription + tag for audio to server
			this.audioNumber += 1;
			this.music = this.sound.add('testAudio'+ this.audioNumber); //SOCKETS! send ID / thing
			this.play = 0;
		});

		this.pauseButton = this.add.text(200,50,"pause audio",{fill:'#0f0'}).setInteractive();
		this.pauseButton.on('pointerdown',() => {
			this.music.pause();
			this.play = 2;
//			console.log(this.music.seek);
		});
		this.i = 0;

	}

	update(){
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

/* Things to change/add:
- make space not pause play when in text box
*/
/*
- things to do:
- map
- sockets
*/
