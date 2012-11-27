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
    var thrusting = false; // Helps with thrust sfx to play only once

    var player = sprites.newSprite("img/small_ship.png", 32,32, 300,300, 0,0, "ship");
    player.onCollision = function(dt,target) {
        // Collided with another ship or the map
        if ((target.tag == "ship") || (target.tag == "map"))
        {
            particles.emitter(this.x, this.y, 10);
            this.x -= this.dx * dt / 1000;
            this.y -= this.dy * dt / 1000;
            this.dx = 0;
            this.dy = 0;
            sfx.playSfx("ship_hit");
            this.hp -= 5;
        }
        // Collided with a bullet
        else if (target.tag == "bullet")
        {
            sprites.removeSprite(target); // remove bullet that hit the ship
            particles.emitter(this.x, this.y, 10);
            sfx.playSfx("ship_hit");
            this.hp -= 20;
        }
        // Died
        if (this.hp <= 0)
        {
            particles.emitter(this.x, this.y, 100);
            //sprites.removeSprite(this);
            this.img.src = "";
            sfx.playSfx("explosion");
            sfx.stopSfx("thruster");
        }
    };

    var lastRefresh = new Date().getTime();

    setInterval(function(){
        var now = new Date().getTime();
        var dt = now-lastRefresh;

        // Left arrow (turn left)
        if(keyboard.keyDown(37)) {
            player.angle -= 0.25 * dt;
        }
        // Right arrow (turn right)
        if(keyboard.keyDown(39)) {
            player.angle += 0.25 * dt;
        }
        // Up arrow (thruster)
        if(keyboard.keyDown(38) && player.hp > 0) {
            player.acceleration = 0.4;
            if (!thrusting)
            {
                sfx.playSfx("thruster");
                thrusting = true;
            }
        } else {
            player.acceleration = 0;
            if (thrusting)
            {
                thrusting = false;
                sfx.stopSfx("thruster");
            }

        }

        if (player.acceleration != 0) {
            particles.emit(player.x,player.y,player.angle-185+Math.random()*10,500,Math.random()*100+100);
        }

        if (player.x+320 > 1280) scrolldiv.style.left = "-" + (1280-640) + "px";
        else scrolldiv.style.left = "-" + (player.x-320) + "px";

        if (player.y+240 > 1440) scrolldiv.style.top = "-" + (1440-480) + "px";
        else scrolldiv.style.top = "-" + (player.y-240) + "px";

        // Spacebar (shoot)
        if(keyboard.keyDown(32) && (shootTime >= 300) && (player.hp > 0)) {
            sfx.playSfx("laser");
            bulletCoords = physics.coordFromAngleDistance(player.x, player.y, player.angle, player.height);
            bullet = sprites.newSprite("img/bullet.png", 4, 4, bulletCoords[0], bulletCoords[1], player.angle, 300, "bullet");
			bullet.dx += player.dx;
			bullet.dy += player.dy;
            bullet.onCollision = function(dt,target) {
                if (target.tag == "map")
                {
                    map.createCrater(this.x, this.y, 16);
                    sprites.removeSprite(this); // remove bullet
                    sfx.playSfx("ground_hit");
                }
            }
            shootTime = 0;
        }
        shootTime+=dt;

        physics.doGravity(map, sprites, dt);

        particles.refresh(dt);
        particles.reDraw();

        sprites.refresh(dt);

        physics.checkCollision(map, sprites, dt);
        sprites.checkCollision(dt);
        sprites.reDraw();

        lastRefresh = now;
    },1000/fps);

});