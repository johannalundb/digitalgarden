var audio = function () {
  /* Exported object. */
  var obj = {};

  /* Internal variables. */
  var audioElement = null;
  var boxes = {};
  var curAudioSrc = null;
  var timo = -1;

  var audioStart = function (src) {
    console.log('audioStop: src=' + src);
    console.log('audioStop: curAudioSrc=' + curAudioSrc);

    if (curAudioSrc === src)
      return;

    audioStop();
    audioElement.attr("src", src);
    audioElement.load();
    audioElement.oncanplaythrough = audioElement.play();
    curAudioSrc = src;
  };

  var audioStop = function () {
    if (curAudioSrc === null)
      return;

    console.log('audioStop');
    audioElement.pause();
    audioElement.currentTime = 0;
    curAudioSrc = null;
  };


  var findBoxInViewport = function (bottom, top) {
    for (var key in boxes) {
      if (bottom > boxes[key].top && top < boxes[key].bottom)
        return key;
    }
    return null;
  };

  var onScrollEnd = function () {
    if (timo >= 0)
      clearTimeout(timo);
    timo = setTimeout(setTrack, 500);
  };

  var setTrack = function () {
    var viewportTop = $(window).scrollTop();
    var viewportBottom = $(window).scrollTop() + $(window).innerHeight();

    console.log('top:    ' + viewportTop);
    console.log('bottom: ' + viewportBottom);

    var boxKey = findBoxInViewport(viewportBottom, viewportTop);

    console.log('box: ' + boxKey);

    if (boxKey != null) {
      var box = boxes[boxKey];
      audioStart(box.src);
    } else {
      audioStop();
    }
  };

  obj.ready = function (iscroll) {
    audioElement = $("#audio-box");

    $(".audio-box").each(function () {
      boxes[this.id] = {
        top:    $(this).offset().top,
        bottom: $(this).offset().top + $(this).outerHeight(),
        src:    $(this).data("audio-src"),
      };
    });

    iscroll.on('scrollEnd', onScrollEnd);
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
    // $("#info-box").click(function(){
    //   $("#info-box").hide();
    //   $("#show-info").removeClass("active");
    // })

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

  // XXX terrible broken, remove?
  // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
  //   capture: false,
  //   passive: false
  // } : false);
});

//sound
// document.onclick = function() {};

// window.onload = function() {
//     var audioMusic = document.querySelector('#music');
//     audioMusic.volume = 0;
// 
//     window.addEventListener('scroll', function(event) {
//         var scrollX = this.scrollX;
//         var scrollY = this.scrollY;
// 
//         if (scrollX > 100 && scrollX < 400 && scrollY > 100 && scrollY < 300) {
//             audioMusic.volume = 1;
//         } else {
//             audioMusic.volume = 0;
//         }
// 
//         console.log(scrollX, scrollY);
//     });
// };
