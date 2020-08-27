var audio = function () {
  /* Exported object. */
  var obj = {};

  /*
   * Points with audio sources, the closest point relative to the current
   * viewport will be played.
   */
  var points = [
    {x: -3300, y: -5000, src: "assets/sound/BG_Crickets.mp3"},
    {x: -2000, y: -1500, src: "assets/sound/BG_Birds.mp3"},
    {x: -16000, y: -15000, src: "assets/sound/BG_Stream Bubbles.mp3"},
    {x: -19600, y: -19000, src: "assets/sound/BG_Underwater.mp3"},
    {x: -3000, y: -19000, src: "assets/sound/BG_Desert Winds.mp3"},
  ];

  /* Other internal variables. */
  var audioElement = null;
  var curAudioSrc = null;
  var timo = -1;
  var _enabled = false;
  var _iscroll = null;

  var audioStart = function (src) {
    if (!_enabled || curAudioSrc === src || src === "")
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

    var headTrack = document.getElementById("music");
    headTrack.volume = 0.5;

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

          if (func)
            func();
        }
      }, 100);

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

  obj.toggle = function (func) {
    _enabled = !_enabled;
    if (_enabled)
      onScrollEnd.apply(_iscroll);
    else
      audioStop();
    func(_enabled);
  };

  obj.ready = function (iscroll) {
    _iscroll = iscroll;
    audioElement = $("#audio-box")[0];
    _iscroll.on('scrollEnd', onScrollEnd);
  };

  return obj;
}();

$(document).ready(function(){
  var myScroll = new IScroll('#wrapper', {
    probeType: 3,
    startY: -10000, //-4050
    startX: -18700, //-18700
    scrollY: true,
    scrollX: true,
    mouseWheel: true,
    freeScroll: true,
    tap: true,
    indicators: [{
      el: document.getElementById('layer01'),
      resize: false,
      ignoreBoundaries: true,
      speedRatioY: 0.8,
      speedRatioX: 0.8
    }, {
      el: document.getElementById('layer02'),
      resize: false,
      ignoreBoundaries: true,
      speedRatioY: 1,
      speedRatioX: 1
    }, {
      el: document.getElementById('background'),
      resize: false,
      ignoreBoundaries: true,
      speedRatioY: 0.6,
      speedRatioX: 0.6
    }]
  });
  $("#background").hide(0).delay(500).fadeIn(2000)
  // $(".info-box").hide(0).delay(1000).fadeIn(2000)
  $("#menu").hide(0).delay(2000).fadeIn(2000)
  $("#small-fountain-of-shells-block").hide(0).delay(3000).fadeIn(2000)
  $("#show-credits").hide(0).delay(2000).fadeIn(2000)
  // $("#show-info").addClass("active");


  // Start audio.
  audio.ready(myScroll);

  $(".smooth-scroll").click(function (e) {
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
      animationDurationMs = 3000,
      targetOffsetX       = 0,
      targetOffsetY       = 0,
      animationEasing     = IScroll.utils.ease.circular);

    e.preventDefault();
  });

  $("#show-info").click(function(){
    if ($(".info-box").is(':hidden')) {
        $(".info-box").fadeIn(600);
        $("#show-info").addClass("active")
        $("#credits").hide();;
    }
    else {
      $(".info-box").fadeOut(300);
      $("#show-info").removeClass("active");
    }
  });

  $("#show-credits").click(function(){
    if ($("#credits").is(':hidden')) {
        $("#credits").fadeIn(600);
        $("#show-credits").addClass("active");
        $(".info-box").hide();
    }
    else {
      $("#credits").fadeOut(600);
      $("#show-credits").removeClass("active");
    }
  });


  $("#sound-toggle").click(function(){
    var button = $(this);
    var mainTrack = $("#music")[0];
    audio.toggle(function (on) {
      if (on) {
        mainTrack.play();
        button.text("Mute sound");
      } else {
        mainTrack.pause();
        button.text("Play sound");
      }
    });
  });
});
