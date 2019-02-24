class Player2Class extends Phaser.Scene {
	constructor(){
		super({key:"Player2"});
	}

	preload(){
		this.load.image('testImage','assets/test4.jpg');
		this.load.audio('testAudio1','assets/audiofiles/SampleAudio_0.4mb.mp3');
		this.load.audio('testAudio2','assets/audiofiles/2.mp3');
		this.load.audio('testAudio3','assets/audiofiles/3.mp3');

		this.load.image('tile', 'assets/tile.png');
    this.load.image('sprite', 'assets/sprite.png');
    this.load.image('sprite2', 'assets/sprite2.png');
	}

	create(){
		//socket.emit('finishTranscript','firstString','secondString');
		const {width, height} = this.sys.game.config;
    this.physics.world.setBounds(0, 0, width, height);
    const bg = this.add.tileSprite(0, 0, width, height, 'tile');
    bg.setOrigin(0,0);

		this.otherPlayers = this.add.group();
		this.partnerID = players[my_player_id]["partner_id"];

		Object.keys(playersPos).forEach((id) => {
      if (id === this.partnerID) {
        this.addPlayer(id); //addPlayer adds the own character
      } else {
        this.addOtherPlayers(id); //adds other players' characters
      };
      // this.addPlayer(id);
    });

		this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.setSize(width, height);
    this.cameras.main.startFollow(this.player, false, 0.1, 0.1);

		this.myContainers = this.physics.add.group();
    this.other_words_dict = {};

		socket.on('newWords', (words, wordsPos, player_id) => {
      if (player_id == my_player_id) { //players[my_player_id]['partner_id']
        for (var i = 0; i < words.length; i++) {
          var wordX = wordsPos[i][0];
          var wordY = wordsPos[i][1];
          var text = this.add.text(0, 0, words[i], {
            font: '20px Arial',
            fill: 'black'
          });
          var yes = this.add.container(wordX, wordY, [text]).setSize(80, 30);
          this.myContainers.add(yes); //this adds each new container to the myContainers group
        }
			} else {
        this.other_words_dict[player_id] = this.physics.add.group();
        for (var i = 0; i < words.length; i++) {
          var wordX = wordsPos[i][0];
          var wordY = wordsPos[i][1];
          var text = this.add.text(0, 0, words[i], {
            font: '20px Arial',
            fill: 'black'
          });
          var yes = this.add.container(wordX, wordY, [text]).setSize(80, 30);
          this.other_words_dict[player_id].add(yes);
        }
      };
    });

		socket.on('otherCollision', (player_id) => {
			if(player_id == this.partnerID) {
				var rem_container = this.myContainers.getChildren()[0];
				this.myContainers.remove(rem_container);
	      rem_container.setVisible(false);
			} else {
				var other_container = this.other_words_dict[player_id];
	      var rem_container = other_container.getChildren()[0];
	      other_container.remove(rem_container);
	      rem_container.setVisible(false);
			}
    });

		socket.on("playerDisconnect", (player_id) => {
			if(player_id == this.partnerID) {
				alert("Your partner disconnected!");
				this.player.destroy();
			} else {
				this.otherPlayers.getChildren().forEach((otherPlayer) => {
	        if (player_id === otherPlayer.playerId) {
	          otherPlayer.destroy();
	        }
				});
    	}
		});

		socket.on('otherPlayerMove', (id, new_pos) => {
			console.log("other player moved");
			if(id == this.partnerID) {
				console.log("my partner moved");
				this.player.x = new_pos['x'];
				this.player.y = new_pos['y'];
			} else {
				this.otherPlayers.getChildren().forEach((otherPlayer) => {
	        if (id === otherPlayer.playerId) {
	          otherPlayer.x = new_pos['x'];
	          otherPlayer.y = new_pos['y'];
	        }
	      });
			}
    });

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

		$('#transcription').keypress((event)=> {
    if (event.which == 13) {
        event.preventDefault();
				this.entered = 1;
    }
		});


		this.play = 0;
		this.typing = 0;
		this.playButton = this.add.text(50,50,"play audio",{fill:'black'}).setInteractive();
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

		this.enter = this.add.text(660,340,"Enter", {fill:'#000'}).setInteractive();
		this.enter.on('pointerdown', () => {
			this.entered = 1;

		});



		this.add.text(600,50, "report audio",{fill:'#000'});
		this.RestartButton = this.add.text(400,50,"restart audio",{fill:'#000'}).setInteractive();
		this.RestartButton.on('pointerdown',()=>{
			this.music = getAudio(this.audioNumber)[0];
			this.music.play();
			this.play = 1;
		});
		this.pauseButton = this.add.text(200,50,"pause audio",{fill:'#000'}).setInteractive();
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
			sceneChange("Start");
			this.scene.start("Start");
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
		if (this.entered == 1) {
			var transcription = document.getElementById("transcription").value;
			$('#transcription').val('');
			socket.emit('finishTranscript',transcription, audio_received[this.audioNumber][1], (audiofile_get, audioID_get) => {
				audio_received.push([audiofile_get, audioID_get]);
				this.audioNumber += 1;
				this.music = getAudio(this.audioNumber)[0];
			});
			this.play = 0;
			this.entered=0;
		}
	}

	addOtherPlayers(player_id) {
    var playerX = playersPos[player_id]['x'];
    var playerY = playersPos[player_id]['y'];
    var otherPlayer = this.add.image(playerX, playerY, 'sprite2');
    otherPlayer.scaleX = 0.5;
    otherPlayer.scaleY = 0.5;
    otherPlayer.playerId = player_id;
    console.log('Other player:' + otherPlayer.playerId);
    this.otherPlayers.add(otherPlayer);
  }

  addPlayer(player_id) {
    var playerX = playersPos[player_id]['x'];
    var playerY = playersPos[player_id]['y'];
    this.player = this.physics.add.image(playerX, playerY, 'sprite');
    // if (player_id == my_player_id) {
    this.player.scaleX = 0.5;
    this.player.scaleY = 0.5;
    //this.player.setCollideWorldBounds(true);
    //this.player.onWorldBounds = true;
  };
};
