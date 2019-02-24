class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({key:"LeaderboardScene"});
  }


  // preload() {
  // 	this.load.html("leaderboard", "assets/leaderboard.html",50,50);
  // }
  // preload() {
  //   this.load.image('testImage','assets/test4.jpg');
  //   this.load.audio('testAudio1','assets/audiofiles/SampleAudio_0.4mb.mp3');
  // }

  create() {

    // Table for leaderboard
      function tableCreate() {
        var body = document.getElementsByTagName('body')[0];
        var tbl = document.createElement('table');
        tbl.style.width = '20%';
        tbl.setAttribute('border', '1');
        var tbdy = document.createElement('tbody');
        for (var i = 0; i < 3; i++) {
          var tr = document.createElement('tr');
          for (var j = 0; j < 2; j++) {
            if (i == 2 && j == 1) {
              break
            } else {
              var td = document.createElement('td');
              td.appendChild(document.createTextNode('\u0020'))
              i == 1 && j == 1 ? td.setAttribute('rowSpan', '2') : null;
              tr.appendChild(td)
            }
          }
          tbdy.appendChild(tr);
        }
        tbl.appendChild(tbdy);
        body.appendChild(tbl)
      }
      tableCreate();

  }

  update() {

    // var tbody


  }

};
