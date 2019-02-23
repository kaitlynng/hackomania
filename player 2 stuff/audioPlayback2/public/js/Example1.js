class Example1 extends Phaser.Scene {
	constructor(){
		super({key:"Example1"});
		self = this;
	}

	preload(){
		self.load.image('testImage','assets/test4.jpg');
		self.load.audio('testAudio1','assets/audiofiles/SampleAudio_0.4mb.mp3');
		self.load.audio('testAudio2','assets/audiofiles/2.mp3');
		self.load.audio('testAudio3','assets/audiofiles/3.mp3');
	};

	create(){
		self.audioNumber = 1;
		self.image = self.add.sprite(400,100,'testImage').setInteractive();
		self.music = self.sound.add('testAudio'+ self.audioNumber);
		self.input.setDraggable(self.image);
		self.input.on('drag',function(pointer,gameObject,dragX){
			var maxX = 600;
			var minX = 300;
			gameObject.x = Math.min(maxX, Math.max(minX,dragX));
			var percentage = (gameObject.x - minX)/(maxX - minX);
			self.music.setSeek(self.music.duration* percentage);
//			console.log(self.music.seek);
		});
		/*
		self.input.on('dragend',function(pointer,gameObject){
			var maxX = 600;
			var minX = 300;
			var percentage = (gameObject.x-minX)/(maxX-minX);
			self.music.setSeek(self.music.duration*percentage);
		})
		*/

		var playBox = this.add.graphics();
		playBox.fillStyle(0xffffff, 0.8);
		playBox.fillRect(300,100,300,2);

		self.play = 0;
		self.playButton = self.add.text(50,50,"play audio",{fill:'#0f0'}).setInteractive();
		self.playButton.on('pointerdown',function(){
			if(self.music.seek == 0){
				self.music.play();
				self.play = 1;
			}
			else{
				self.music.resume();
				self.play = 1;
			};
		});

		// space bar pause and play
		self.input.keyboard.on('keydown-SPACE', function (event) {
			if (self.play == 0) {
				self.music.play();
				self.play = 1; //playing
			}
			else if (self.play == 1){
				self.music.pause();
				self.play = 2; // paused
			}
			else if (self.play == 2){
				self.music.resume();
				self.play = 1;
			}
			console.log('Hello from the A Key!');
		});


		self.enter = self.add.text(660,340,"Enter", {fill:'#0f0'}).setInteractive();
		self.enter.on('pointerdown',function(){
			var transcription = document.getElementById("text-field").value;
			console.log(transcription); // SOCKETS!! send transcription + tag for audio to server
			self.audioNumber += 1;
			self.music = self.sound.add('testAudio'+ self.audioNumber); //SOCKETS! send ID / thing
			self.play = 0;
		})

		self.pauseButton = self.add.text(200,50,"pause audio",{fill:'#0f0'}).setInteractive();
		self.pauseButton.on('pointerdown',function(){
			self.music.pause();
			self.play = 2;
//			console.log(self.music.seek);
		})


		self.i = 0;


	}


	update(){
		var playPercent = self.music.seek / self.music.duration;
		self.image.x = 300 + 300*playPercent;

		self.i += 1;
		if(self.i == 50){
			self.i = 0;
		}

		if (self.music.seek>self.music.duration){
			self.music.stop();
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
