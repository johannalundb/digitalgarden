var audio = function () {
  /* Exported object. */
  var obj = {};

  /*
   * Points with audio sources, the closest point relative to the current
   * viewport will be played.
   */
  var points = [
    {x: -3000, y: -3000, src: "assets/sound/background-crickets.mp3"},
    {x: -3000, y: -7000, src: "assets/sound/background-birds.mp3"},
  ];

  /* Other internal variables. */
  var audioElement = null;
  var curAudioSrc = null;
  var timo = -1;

  var audioStart = function (src) {
    if (curAudioSrc === src || src === "")
      return;

    audioStop(function () {
      console.log('audioStart: src=' + src);

      audioElement.src = src;
      audioElement.volume = 1;
      audioElement.load();
      audioElement.oncanplaythrough = audioElement.play();
      curAudioSrc = src;
    });
  };

  var audioStop = function (func) {
    if (curAudioSrc !== null) {
      console.log('audioStop: src=' + curAudioSrc);

      // Lower the volume down to zero in steps of 0.1 every 200ms, then invoke
      // the callback letting another audio src play.
      var volTimo = setInterval(function () {
        console.log('volTimo: volume=' + audioElement.volume);
        if (audioElement.volume > 0.1) {
          audioElement.volume -= 0.1;
        } else {
          clearInterval(volTimo);

          audioElement.pause();
          audioElement.currentTime = 0;
          curAudioSrc = null;

          func();
        }
      }, 200);

      return;
    }

    if (func)
      func();
  };

  var findClosestPoint = function (x, y) {
    var minDelta = Number.MAX_VALUE;
    var minSrc = null;

    console.log('findClosestPoint: x='+ x + ', y=' + y);

    for (var i = 0; i < points.length; i++) {
      var deltaX = x - points[i].x;
      var deltaY = y - points[i].y;
      var delta = (deltaX * deltaX) + (deltaY * deltaY);
      if (delta < minDelta) {
        minDelta = delta;
        minSrc = points[i].src;
      }
    }

    return minSrc;
  };

  var onScrollEnd = function () {
    var x = this.x;
    var y = this.y;

    if (timo >= 0)
      clearTimeout(timo);

    timo = setTimeout(function () {
      setTrack(x, y);
    }, 500);
  };

  var setTrack = function (x, y) {
    var src = findClosestPoint(x, y);

    if (src != null) {
      audioStart(src);
    } else {
      audioStop();
    }
  };

  obj.ready = function (iscroll) {
    audioElement = $("#audio-box")[0];
    iscroll.on('scrollEnd', onScrollEnd);

    // Start playing the closest audio immediately.
    onScrollEnd.apply(iscroll);
  };

  return obj;
}();

$(document).ready(function(){
  var myScroll = new IScroll('#wrapper', {
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

  // Start audio.
  audio.ready(myScroll);

  $(".smooth-scroll").click(function () {
    var targetName = this.hash;
    var target = $(targetName);

    // Sanity check, verify that the scroll destination exists.
    if (target.length === 0) {
      console.error("smooth scroll target " + targetName + " does not exists");
      return;
    }

    // Target exists, lets go scrolling.
    // The animation easing could either be: quadratic, circular, back, bounce, elastic.
    myScroll.scrollToElement(
      destination         = target[0],
      animationDurationMs = 1000,
      targetOffsetX       = 0,
      targetOffsetY       = 0,
      animationEasing     = IScroll.utils.ease.back);
  });

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

  $("#sound-on").click(function(){
    $("#sound-on").hide();
    $("#sound-off").show();
    // $("music").prop('muted', false);
    jQuery('music').prop("muted", true);
  });

  $("#sound-off").click(function(){
    $("#sound-off").hide();
    $("#sound-on").show();
    jQuery('music').prop("muted", true);
  });
});
