define(function(require,exports){
    var keyboard = require("./keyboard");
    //var gfx = require("./gfx");
    //var network = require("./network");
    //var gameObject = require('./gameobject');
    var sfx = require("./sfx");
    var map = require('./map');
    var particles = require('./particles');

    // Init sound and start music.
    sfx.init();
    //sfx.playBgm("bgm");

    // Init and load map
    map.init('#mapcanvas');
    //map.loadMap('/img/map.png');

    // Init particle engine.
    particles.init('#particlecanvas');
    particles.emit(100,100);
    var fps = 60;

    setInterval(function(){
        // Refresh and draw particles.
        particles.emit(100,100);
        particles.reDraw();
    },1000/fps);

});