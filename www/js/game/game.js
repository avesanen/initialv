define(function(require,exports){
    var keyboard = require("./keyboard");
    //var gfx = require("./gfx");
    //var network = require("./network");
    var sfx = require("./sfx");
    var map = require('./map');
    var particles = require('./particles');
    var sprites = require('./sprites');

    // Init sound and start music.
    sfx.init();
    //sfx.playBgm("bgm");

    // Init and load map
    map.init("#mapcanvas");
    map.loadMap("img/testmap.png");

    // Init particle engine.
    particles.init('#particlecanvas');

    // Init sprite engine
    sprites.init('#spritecanvas');

    var fps = 60;

    var player = sprites.newSprite(100,100,0,0,map);

    setInterval(function(){
        if(keyboard.keyDown(37)) {
            player.angle -= 3;
        }
        if(keyboard.keyDown(39)) {
            player.angle += 3;
        }
        if(keyboard.keyDown(38)) {
            player.acceleration = 0.003;
        } else {
            player.acceleration = 0;
        }

        // Refresh and draw particles.
        //map.createCrater(Math.random()*1280, Math.random()*960);

        if (player.acceleration != 0) {
            particles.emit(player.x,player.y,player.angle-190+Math.random()*20,300,Math.random()*100+100);
        }
        particles.reDraw();
        sprites.reDraw();
    },1000/fps);

});