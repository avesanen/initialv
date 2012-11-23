define(function(require,exports){
    var io = require("socket.io/socket.io");
    var keyboard = require("./keyboard");
    var gfx = require("./gfx");
    var socket = io.connect();

    var objects = {};

	// TODO:
    //  at 60hz:
    //      for each in objects:
    //          each.move by deltas
    //          gfx.draw each
    //
    //  on message from io, if message is new object:
    //      add new object to objects
    //
    //  on message from io, is message is delete object:
    //      delete object from objects
    //
    //  on message from io, if message is sync:
    //      for each in objects:
    //          if each not in message: delete each.
    //          else each = object in message
    //
    //  at 5hz:
    //      send player controlled object to io to be broadcasted


    // TESTING CODE ->
    var gameObject = require('./gameobject');

	// Some sprite
    spr = gameObject.newGameObject();
    spr.img.src = "img/sprite.png";
    spr.height = 128;
    spr.width = 128;
	
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
		
    setInterval(function(){
		// Draw the map image to map canvas - do only once at the beginning of game
		// The map canvas is then "destroyed" by explosion sprites and a part of it
		// is always copied to main canvas as the background :)
        if (!this.mapDrawn)
		{
			gfx.drawSprite(mapOriginal, true);
			this.mapDrawn = true;
		}
		gfx.clear();
		gfx.drawMap(spr.x, spr.y);
        gfx.drawSprite(spr);
        spr.refresh();

        if (spr.x >= 640-64){spr.dx=-50;spr.dangle=Math.random()*5-2.5}
        if (spr.y >= 480-64){spr.dy=-50;spr.dangle=Math.random()*5-2.5}
        if (spr.x <= 64){spr.dx=50;spr.dangle=Math.random()*5-2.5}
        if (spr.y <= 64){spr.dy=50;spr.dangle=Math.random()*5-2.5}
		
		// Do random craters just to demonstrate them
		if (Math.random()<1.0)
		{
			crater.x = Math.random()*1280;
			crater.y = Math.random()*960;
			gfx.drawSprite(crater, true);
		}
    },1000/fps);
});