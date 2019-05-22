var audio = function () {
  /* Exported object. */
  var obj = {};

  /*
   * Points with audio sources, the closest point relative to the current
   * viewport will be played.
   */
  var points = [
    {x: 0, y: -2000, src: "assets/sound/background-crickets.mp3"},
    {x: -8159, y: -4741, src: "assets/sound/background-above-water.mp3"},
    {x: -7000, y: -18000, src: "assets/sound/background-birds.mp3"},
    {x: -3000, y: -9000, src: "assets/sound/background-below-water.mp3"},
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
    startY: -3752,
    startX: -18650,
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
      animationDurationMs = 2000,
      targetOffsetX       = 0,
      targetOffsetY       = 0,
      animationEasing     = IScroll.utils.ease.circular);

    e.preventDefault();
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

  $("#show-embroidery").click(function(){
    if ($("#embroidery").is(':hidden')) {
        $("#embroidery").show();
        $("#show-embroidery").addClass("active");
        // $("#info-box").hide();
    }
    else {
      $("#embroidery").hide();
      $("#show-embroidery").removeClass("active");
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
