define(function(require){
    var keyboard = require("./keyboard");
    //var gfx = require("./gfx");
    //var network = require("./network");
    var sfx = require("./sfx");
    var map = require('./map');
    var particles = require('./particles');
    var sprites = require('./sprites');
    var physics = require('./physics');

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

    var scrolldiv = $('#scrolldiv')[0];

    console.log(scrolldiv)
    physics.init();

    var fps = 60;
    var shootTime = 0; // Time since last bullet shot

    var player = sprites.newSprite("img/small_ship.png", 32,32, 300,300,0,0);
    player.onCollision = function(dt) {
        map.createCrater(this.x, this.y);
        particles.emitter(this.x, this.y, 10);
        this.x -= this.dx * dt / 1000;
        this.y -= this.dy * dt / 1000;
        this.dx = 0;
        this.dy = 0;
    };

    var lastRefresh = new Date().getTime();

    setInterval(function(){
        var now = new Date().getTime();
        var dt = now-lastRefresh;

        // Left arrow (turn left)
        if(keyboard.keyDown(37)) {
            player.angle -= 4;
        }
        // Right arrow (turn right)
        if(keyboard.keyDown(39)) {
            player.angle += 4;
        }
        // Up arrow (thruster)
        if(keyboard.keyDown(38)) {
            player.acceleration = 4;
        } else {
            player.acceleration = 0;
        }

        if (player.acceleration != 0) {
            particles.emit(player.x,player.y,player.angle-185+Math.random()*10,500,Math.random()*100+100);
        }

        if (player.x+320 > 1280) scrolldiv.style.left = "-" + (1280-640) + "px";
        else scrolldiv.style.left = "-" + (player.x-320) + "px";

        if (player.y+240 > 1440) scrolldiv.style.top = "-" + (1440-480) + "px";
        else scrolldiv.style.top = "-" + (player.y-240) + "px";

        // Spacebar (shoot)
        if(keyboard.keyDown(32) && shootTime >= 15) {
            bullet = sprites.newSprite("img/bullet.png", 4, 4, player.x, player.y, player.angle, 300);
			bullet.dx += player.dx;
			bullet.dy += player.dy;
            //bullet.img.src = "img/bullet.png";
            //keyboard.releaseKey(32);
            bullet.onCollision = function() {
                map.createCrater(this.x, this.y, 16);
                sprites.spritelist.splice(sprites.spritelist.indexOf(this), 1);
            }
            shootTime = 0;
        }
        shootTime++;

        particles.refresh(dt);
        particles.reDraw();

        sprites.refresh(dt);

        physics.checkCollision(map, sprites, dt);
        sprites.reDraw();

        lastRefresh = now;
    },1000/fps);

});