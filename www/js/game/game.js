define(function(require,exports){
    var keyboard = require("./keyboard");
    var gfx = require("./gfx");
    var network = require("./network");
    var gameObject = require('./gameobject');
    var sfx = require("./sfx");

	// Some sprite
    spr = gameObject.newGameObject();
    spr.img.src = "img/sprite.png";
    spr.height = 128;
    spr.width = 128;
    spr.x = 100;
    spr.y = 100;
    spr.dx = 50;
    spr.dy = 50;
	
	// "Crater" that is drawn to the map canvas if a bullet hits it causing damage to the map
	crater = gameObject.newGameObject();
    crater.img.src = "img/crater.png";
    crater.height = 32;
    crater.width = 32;

    var fps = 60;
	
	// Hold the map image. It can be large since it is drawn only once.
	mapOriginal = gameObject.newGameObject();
	mapOriginal.img.src = "img/map.png";
	mapOriginal.width = 1280;
	mapOriginal.height = 960;
	mapOriginal.x = mapOriginal.width / 2; // Because drawSprite is centered
	mapOriginal.y = mapOriginal.height / 2;
    gfx.drawSprite(mapOriginal, true);

    sfx.init();

    sfx.playBgm("bgm");
    setInterval(function(){
        var player = gameObject.list[network.player_uuid];
        if(keyboard.keyDown(37)) {
            player.dangle -= 0.1;
        }
        if(keyboard.keyDown(39)) {
            player.dangle += 0.1;
        }
        if(keyboard.keyDown(38)) {
            player.dx += Math.sin(player.angle)/500;
            player.dy -= Math.cos(player.angle)/500;
            player.dx += Math.sin(player.angle)*5;
            player.dy -= Math.cos(player.angle)*5;
        }

        gfx.clear();
        gfx.drawMap(player.x, player.y);
        for (var i in gameObject.list) {
            if (gameObject.list.hasOwnProperty(i)) {
                var obj = gameObject.list[i];
                obj.refresh();
                if (obj.x > 640-32){
                    obj.x = 640-32;
                    obj.dx=-obj.dx;
                    sfx.playSfx(0);
                }
                if (obj.y > 480-32){
                    obj.y=480-32;
                    obj.dy=-obj.dy;
                    sfx.playSfx(0);
                }
                if (obj.x < 32){
                    obj.x = 32;
                    obj.dx=-obj.dx;
                    sfx.playSfx(0);
                }
                if (obj.y < 32){
                    obj.y=32;
                    obj.dy=-obj.dy;
                    sfx.playSfx(0);
                }
                gfx.drawSprite(obj);
            }
        }

        console.log(gfx.getMapCollision(player.x, player.y));

        crater.x = Math.random()*1280;
        crater.y = Math.random()*960;
        gfx.drawSprite(crater, true);

    },1000/fps);

});