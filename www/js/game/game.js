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

    spr = gameObject.newGameObject();
    spr.img.src = "img/sprite.png";
    spr.height = 128;
    spr.width = 128;
    var fps = 60;

    setInterval(function(){
        gfx.clear();
        gfx.drawSprite(spr);
        spr.refresh();

        if (spr.x >= 640-64){spr.dx=-50;spr.dangle=Math.random()*5-2.5}
        if (spr.y >= 480-64){spr.dy=-50;spr.dangle=Math.random()*5-2.5}
        if (spr.x <= 64){spr.dx=50;spr.dangle=Math.random()*5-2.5}
        if (spr.y <= 64){spr.dy=50;spr.dangle=Math.random()*5-2.5}
    },1000/fps);
});