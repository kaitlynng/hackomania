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
		//socket.emit('finishTranscript','firstString','secondString');
		this.entered = 0;
		this.audioNumber = 0;
		this.image = this.add.sprite(450,55,'testImage').setInteractive();
		this.music = getAudio(this.audioNumber)[0];
		this.input.setDraggable(this.image);
		this.input.on('drag',(pointer,gameObject,dragX)=>{
			var maxX = 600;
			var minX = 300;
			gameObject.x = Math.min(maxX, Math.max(minX,dragX));
			var percentage = (gameObject.x - minX)/(maxX - minX);
			this.music.setSeek(this.music.duration* percentage);
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
		playBox.fillRect(350,55,300,2);

		$('#transcription').keypress((event)=> {
    if (event.which == 13) {
        event.preventDefault();
				this.entered = 1;
    }
		});


		this.play = 0;
		this.typing = 0;
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

		$("#transcription").focus(() => {
			this.typing = 1;

		});
		// space bar pause and play
		this.input.keyboard.on('keydown-SPACE', (event) => {
			if (this.play == 0 && this.typing == 0) {
				this.music.play();
				this.play = 1; //playing
			}
			else if (this.play == 1 && this.typing == 0){
				this.music.pause();
				this.play = 2; // paused
			}
			else if (this.play == 2 && this.typing == 0){
				this.music.play();
				this.play = 1;
			}
		});

		this.enter = this.add.text(660,340,"Enter", {fill:'#0f0'}).setInteractive();
		this.enter.on('pointerdown', () => {
			this.entered = 1;

		});



		this.pauseButton = this.add.text(200,50,"pause audio",{fill:'#0f0'}).setInteractive();
		this.pauseButton.on('pointerdown',() => {
			this.music.pause();
			this.play = 2;
		});
		this.i = 0;

		// this.scene.add('test', Player2, true, { x: 300, y: 200 });
		// const {width, height} = this.sys.game.config;
		// this.worldCamera = this.scene.get('Player1S1').cameras.main.setBounds(width, height);
		// this.scene.moveUp('Player1S1');
		// this.worldCamera.setSize(1000, 500);
		// this.worldCamera.centerOn(cameraWidth/2, cameraHeight/2);

		socket.on('EndGame',() => {
			this.scene.stop();
			sceneChange("LeaderboardScene");
			this.scene.start("LeaderboardScene");
		});

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
		console.log('this.entered is '+ this.entered);
		if (this.entered == 1) {
			var transcription = document.getElementById("transcription").value;
			$('#transcription').val('');
			socket.emit('finishTranscript',transcription, audio_received[this.audioNumber][1], (audiofile_get, audioID_get) => {
				audio_received.push([audiofile_get, audioID_get]);
				this.audioNumber += 1;
				console.log(audio_received);
				console.log('audionumber is '+ this.audioNumber);
				this.music = getAudio(this.audioNumber)[0];
			});

			this.play = 0;
			this.entered=0;
		}
	}
};
