$(document).ready(function(){
   console.log("jquery ready");
});

function checkHTML(active_scene) {
  if(active_scene == "Wait") {
    $("#text-form").hide();
  }
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
