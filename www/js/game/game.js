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

    // Init sprite engine
    sprites.init('#spritecanvas', map);

    // Init and load map
    map.init("#mapcanvas", sprites);
    map.loadMap("testmap.json");
    /*for(var i=0; i<map.dockList.length; i++)
    {
        console.log(map.dockList[i]);
        var dock = sprites.newSprite("img/dock.png", 48, 16, map.dockList[i][0], map.dockList[i][1], 0, 0, "dock");
        dock.onCollision = function(dt, target)
        {
            if (target.tag == "ship") {
                //console.log("docked");
                target.docked = true;
            }
        }
    }*/

    var plasmaCloud = sprites.newSprite("img/plasma_cloud.png",160,120,250,250,0,0,"plasma", 1);
    plasmaCloud.onCollision = function(dt,target) {
        if(target.tag == "bullet")
        {
            // damage ships that are near the cloud
            var cloudSprites = sprites.getNearbySprites(this.x, this.y, 120);
            for (var i=0; i<cloudSprites.length; i++) {
                if (cloudSprites[i].tag == "ship")
                {
                    cloudSprites[i].hp -= 50;
                    sfx.playSfx("ship_hit");
                }

            }
            sfx.playSfx("explosion");
            particles.emitter(this.x, this.y, 50);
            map.createCrater(this.x, this.y, 70);
            sprites.removeSprite(target); // remove bullet
            sprites.removeSprite(this); // remove cloud
        }
    };

    var hideCloud = sprites.newSprite("img/hiding_cloud.png",320,120,500,150,0,0,"hide",1);
    hideCloud.onCollision = function(dt,target) {

    };

    // Init particle engine.
    particles.init('#particlecanvas');

    var scrolldiv = $('#scrolldiv')[0];

    console.log(scrolldiv)
    physics.init();

    var fps = 60;
    var shootTime = 0; // Time since last bullet shot
    var bombShootTime = 0;
    var thrusting = false; // Helps with thrust sfx to play only once

    /**
     * A function for creating bullet sprite with just few parameters
     * @param x where to launch from
     * @param y
     * @param dx additional delta
     * @param dy
     * @param angle angle of bullet
     * @param height how far will the bullet be from x,y initially
     */
    createBullet = function(x, y, dx, dy, angle, height) {
        bulletCoords = physics.coordFromAngleDistance(x, y, angle, height);
        bullet = sprites.newSprite("img/bullet.png", 4, 4, bulletCoords[0], bulletCoords[1], angle, 300, "bullet", 0);
        bullet.dx += dx;
        bullet.dy += dy;
        bullet.onCollision = function(dt,target) {
            if (target.tag == "map")
            {
                map.createCrater(this.x, this.y, 16);
                sprites.removeSprite(this); // remove bullet
                sfx.playSfx("ground_hit");
            }
        }
    };

    var player = sprites.newSprite("img/small_ship.png", 32,32, 600,300, 0,0, "ship", 0);
    player.onCollision = function(dt,target) {
        var doDamage = 0;
        // Collided with another ship or the map
        if ((target.tag == "ship") || (target.tag == "map"))
        {
            this.x -= this.dx * dt / 1000;
            this.y -= this.dy * dt / 1000;
            this.dx = 0;
            this.dy = 0;
            if (this.docked)
            {
                //this.angle = 0;
            }
            else
            {
                particles.emitter(this.x, this.y, 10);
                sfx.playSfx("ship_hit");
                doDamage = 5;
            }
        }
        // Collided with a bullet
        else if (target.tag == "bullet")
        {
            sprites.removeSprite(target); // remove bullet that hit the ship
            particles.emitter(this.x, this.y, 10);
            sfx.playSfx("ship_hit");
            doDamage = 20;
        }
        // Damage
        this.hp -= doDamage;
        // Died
        if (this.hp <= 0 && this.hp > -1000 && doDamage > 0)
        {
            particles.emitter(this.x, this.y, 100);
            //this.visible = false;
            this.img.src="img/small_ship_broken.png";
            sfx.playSfx("explosion");
            sfx.stopSfx("thruster");
            map.createCrater(this.x, this.y, 100);
            this.dy += 0.001; // allow dead ship to "fall down" if it died staying still
            this.hp = -1000; // very dead, don't do explosions and falling down ever again ;)
        }
    };

    var lastRefresh = new Date().getTime();

    setInterval(function(){
        var now = new Date().getTime();
        var dt = now-lastRefresh;

        // Left arrow (turn left)
        if(keyboard.keyDown(37) && player.hp>0) {
            player.angle -= 0.25 * dt;
        }
        // Right arrow (turn right)
        if(keyboard.keyDown(39) && player.hp>0) {
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
            particles.emit(player.x,player.y,player.angle-185+Math.random()*10,100,Math.random()*100+1000);
        }

        if (player.x+320 > 1280) scrolldiv.style.left = "-" + (1280-640) + "px";
        else scrolldiv.style.left = "-" + (player.x-320) + "px";

        if (player.y+240 > 1440) scrolldiv.style.top = "-" + (1440-480) + "px";
        else scrolldiv.style.top = "-" + (player.y-240) + "px";

        // Spacebar (shoot)
        if(keyboard.keyDown(32) && (shootTime >= 300) && (player.hp > 0)) {
            sfx.playSfx("laser");
            createBullet(player.x, player.y, player.dx, player.dy, player.angle, player.height);
            shootTime = 0;
        }
        shootTime+=dt;

        // Down arrow (shoot bomb)
        if(keyboard.keyDown(40) && (bombShootTime >= 3000) && (player.hp > 0)) {
            // Shoot the bomb
            sfx.playSfx("bomb_shoot");
            bombCoords = physics.coordFromAngleDistance(player.x, player.y, player.angle, player.height + 8);
            bomb = sprites.newSprite("img/bomb.png", 16, 16, bombCoords[0], bombCoords[1], player.angle, 150, "bomb", 0);
            bomb.dx += player.dx;
            bomb.dy += player.dy;
            // Kick player backwards, because the bomb is so powerful
            kick = physics.coordFromAngleDistance(0, 0, -player.angle, 200);
            player.dx += kick[0];
            player.dy -= kick[1];
            // When bomb collides, it divides to smaller bullets
            bomb.onCollision = function(dt,target) {
                if (target.tag == "map" || target.tag == "ship")
                {
                    map.createCrater(this.x, this.y, 64);
                    sprites.removeSprite(this);
                    sfx.playSfx("bomb_explode");
                    for (var i=0; i<360; i+=36)
                    {
                        createBullet(this.x, this.y, this.dx, this.dy, i, 0);
                    }
                }
            }
            bombShootTime = 0;
        }
        bombShootTime+=dt;

        physics.doGravity(map, sprites, dt);

        particles.refresh(dt);
        particles.reDraw();

        sprites.refresh(dt);

        physics.checkCollision(map, sprites, dt);
        player.docked = false; // docking information not needed after map collision check - allow for new check
        sprites.checkCollision(dt);
        sprites.reDraw();

        // Increase player's health, if docked, not dead and not at max
        if (player.docked && player.hp > 0 && player.hp < 100)
        {
            player.hp += dt * 0.005;
        }

        // Update status bar
        var statusHealth = Math.round(player.hp);
        if (statusHealth < 0) statusHealth = 0;
        $("div#statusdiv").text("Integrity: " + statusHealth + "%");

        lastRefresh = now;



    },1000/fps);

});