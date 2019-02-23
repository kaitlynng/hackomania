$(document).ready(function(){
   console.log("jquery ready");
});

function checkHTML(active_scene) {
  if(active_scene == "Wait") {
    $("#text-form").hide();
  }
}

// $("#text-field").focus(function()
// {
//   console.log('meow');
// })
