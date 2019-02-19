class Example1 extends Phaser.Scene {
	constructor(){
		super({key:"Example1"});
		self = this;
	}
	preload(){
		self.load.image('testImage','assets/test4.jpg');
		self.load.audio('testAudio','assets/audiofiles/SampleAudio_0.4mb.mp3');
		
	};
	create(){
		self.image = self.add.sprite(400,300,'testImage').setInteractive();
		self.music = self.sound.add('testAudio');

		/*
		//FOR EVENT ON MOUSE-OVER
		self.image.on('pointerover',function(){
		})
		*/

		self.input.setDraggable(self.image);
		self.input.on('drag',function(pointer,gameObject,dragX){
			var maxX = 600;
			var minX = 300;
			gameObject.x = Math.min(maxX, Math.max(minX,dragX));
			var percentage = (gameObject.x - minX)/(maxX - minX);
			self.music.setSeek(self.music.duration* percentage);
			console.log(self.music.seek);
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
		playBox.fillRect(300,300,300,2);

		
		self.playButton = self.add.text(50,50,"play audio",{fill:'#0f0'}).setInteractive();
		self.playButton.on('pointerdown',function(){
			if(self.music.seek == 0){
				self.music.play();
			}
			else{
				self.music.resume();
			};
		});


		self.pauseButton = self.add.text(200,50,"pause audio",{fill:'#0f0'}).setInteractive();
		self.pauseButton.on('pointerdown',function(){
			self.music.pause();
			console.log(self.music.seek);
		})

		self.i = 0;
	}
	update(){
		var playPercent = self.music.seek / self.music.duration;
		self.image.x = 300 + 300*playPercent;

		self.i += 1;
		if(self.i == 50){
			console.log(self.music.seek);
			console.log(playPercent);
			self.i = 0;
		}

		if (self.music.seek>self.music.duration){
			self.music.stop();
		};

	}
};