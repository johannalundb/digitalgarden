
// document.onclick = function() {};

window.onload = function() {
    var audioHorse = document.querySelector('#horse');
    audioHorse.volume = 0;

    window.addEventListener('scroll', function(event) {
        var scrollX = this.scrollX;
        var scrollY = this.scrollY;

        if (scrollX > 0 && scrollX < 100 && scrollY > 0 && scrollY < 100) {
            audioHorse.volume = 1;
        } else {
            audioHorse.volume = 0;
        }

        console.log(scrollX, scrollY);
    });
};
