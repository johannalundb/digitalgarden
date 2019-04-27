$(document).ready(function(){
  
  $("#show-info").click(function(){
    if ($("#info-box").is(':hidden')) { 
        $("#info-box").show();
        $("#show-info").addClass("active");
    }
    else {
      $("#info-box").hide();
      $("#show-info").removeClass("active");
    }
  });
    // $("#info-box").click(function(){
    //   $("#info-box").hide();
    //   $("#show-info").removeClass("active");
    // })

  $("#sound-on").click(function(){
    $("#sound-on").hide();
    $("#sound-off").show();
    // $("music").prop('muted', false);
    jQuery('music').prop("muted", true);
  })

  $("#sound-off").click(function(){
    $("#sound-off").hide();
    $("#sound-on").show();
    jQuery('music').prop("muted", true);
  })
})

var myScroll;
var intFrameWidth = window.innerWidth;


function loaded () {
  myScroll = new IScroll('#wrapper', {
    startY: -3000,
    startX: -3000,
    scrollY: true,
    scrollX: true,
    mouseWheel: true,
    indicators: [{
      el: document.getElementById('layer01'),
      resize: false,
      ignoreBoundaries: true,
      speedRatioY: 0.6,
      speedRatioX: 0.6
    }, {
      el: document.getElementById('layer02'),
      resize: false,
      ignoreBoundaries: true,
      speedRatioY: 0.8,
      speedRatioX: 0.8
    }, {
      el: document.getElementById('background'),
      resize: false,
      ignoreBoundaries: true,
      speedRatioY: 0.4,
      speedRatioX: 0.4
    }]
  });
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
  capture: false,
  passive: false
} : false);


//sound
document.onclick = function() {};

window.onload = function() {
    var audioMusic = document.querySelector('#music');
    audioMusic.volume = 0;

    window.addEventListener('scroll', function(event) {
        var scrollX = this.scrollX;
        var scrollY = this.scrollY;

        if (scrollX > 100 && scrollX < 400 && scrollY > 100 && scrollY < 300) {
            audioMusic.volume = 1;
        } else {
            audioMusic.volume = 0;
        }

        console.log(scrollX, scrollY);
    });
};
