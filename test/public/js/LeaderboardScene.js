class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({key:"LeaderboardScene"});
  }


  preload() {
    this.load.image("start-background", "../assets/jiazua-background.png");
    this.load.image("gameover", "../assets/gameover.jpg");
  }
  // preload() {
  //   this.load.image('testImage','assets/test4.jpg');
  //   this.load.audio('testAudio1','assets/audiofiles/SampleAudio_0.4mb.mp3');
  // }

  create() {
    this.background = this.add.image(0, 0, "start-background").setOrigin(0, 0);
    this.image = this.add.image(630, 300, "gameover");
    /*
    socket.emit('leaderboard');
    socket.on('loadingLeaderboard',(sortedScore)=>{
      console.log(sortedScore);
      this.winner_name = this.add.text(400, 300, sortedScore[0][0]);
      this.winner_score = this.add.text(500, 300, sortedScore[0][1]);
    });
    */



    // Table for leaderboard
      // function tableCreate() {
      //   var body = document.getElementsByTagName('body')[0];
      //   var tbl = document.createElement('table');
      //   tbl.style.width = '20%';
      //   tbl.setAttribute('border', '1');
      //   var tbdy = document.createElement('tbody');
      //   for (var i = 0; i < 3; i++) {
      //     var tr = document.createElement('tr');
      //     for (var j = 0; j < 2; j++) {
      //       if (i == 2 && j == 1) {
      //         break
      //       } else {
      //         var td = document.createElement('td');
      //         td.appendChild(document.createTextNode('\u0020'))
      //         i == 1 && j == 1 ? td.setAttribute('rowSpan', '2') : null;
      //         tr.appendChild(td)
      //       }
      //     }
      //     tbdy.appendChild(tr);
      //   }
      //   tbl.appendChild(tbdy);
      //   body.appendChild(tbl)
      // }
      // tableCreate();


      // var table = document.createElement('table');
      // table.style.width = '20%';
      // table.setAttribute('border', '1');
      //
      // for (var row of sortedScores) {
      //   table.insertRow();
      //   for (var cell of row) {
      //     var newCell = table.rows[table.rows.length - 1].insertCell();
      //     newCell.textContent = cell;
      //   }
      // }
      //
      // document.body.appendChild(table);

  }

  update() {

    // var tbody


  }

};
