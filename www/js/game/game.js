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
    sprites.init('#spritecanvas', map);

    var fps = 60;

    var player = sprites.newSprite(100,100,0,0,map);

    var lastRefresh = new Date().getTime();

    setInterval(function(){
        var now = new Date().getTime();
        var dt = now-lastRefresh;

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

        particles.refresh(dt);
        particles.reDraw();

        sprites.refresh(dt);
        if(map.getMapCollision(player.x, player.y)) {
            player.x -= player.dx * dt;
            player.y -= player.dy * dt;
            player.dx = -player.dx/2;
            player.dy = -player.dy/2;
        }
        sprites.reDraw();

        lastRefresh = now;
    },1000/fps);

});