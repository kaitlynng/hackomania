$(document).ready(function(){
   console.log("jquery ready");
   $('#start-div').hide();
   $('#player2-div').hide();
});

function checkHTML(active_scene) {
  if(active_scene == "Start") {
    $("#start-div").show();
    $('#player2-div').hide();
  }
  else if(active_scene == "Wait") {
    $('#start-div').hide();
    $('#player2-div').hide();
  }
  else if(active_scene == "Player2") {
    $('#start-div').hide();
    $('#player2-div').show();
  }
  else {
    $('#start-div').hide();
    $('#player2-div').hide();
  };
}

function reloadPlayer(audioUrl) {
  $("#player").attr('src', audioUrl);
  $("#player")[0].pause();
  $("#player")[0].load();
};

$("#recorder").click(()=>{
  if(!record_event) {
    record_event = true;
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(handleAudioSuccess);
    $('#recorder').html("Stop");
  } else {
    record_event = false;
    mediaRecorder.stop();
    $('#recorder').html("Record");
  }
});
