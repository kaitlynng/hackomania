class Example1 extends Phaser.Scene {
	constructor(){
		super({key:"Example1"});
		self = this;
	}
	preload(){
		self.load.image('testImage','assets/test4.jpg');
		self.load.audio('testAudio','assets/audiofiles/SampleAudio_0.4mb.mp3');
		var playButton = self.add.graphics();
		playButton.fillStyle(0xffffff, 1);
		playButton.fillRect(50,50,300,200);
	};
	create(){
		self.image = self.add.sprite(400,300,'testImage').setInteractive();

		/*
		//FOR EVENT ON MOUSE-OVER
		self.image.on('pointerover',function(){
		})
		*/

		self.input.setDraggable(self.image);
		this.input.on('drag',function(pointer,gameObject,dragX){
			var maxX = 600;
			var minX = 300;
			gameObject.x = Math.min(maxX, Math.max(minX,dragX));
			var percentage = (gameObject.x - minX)/(maxX - minX);
		});

		
	}
};