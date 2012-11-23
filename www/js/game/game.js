define(function(require,exports){
    var keyboard = require("./keyboard");
    var gfx = require("./gfx");
    var network = require("./network");

    var objects = {};

    // TESTING CODE ->
    var gameObject = require('./gameobject');
    var fps = 60;

    setInterval(function(){
        var player = gameObject.list[network.player_uuid];
        if(keyboard.keyDown(37)) {
            player.dangle -= 0.1;
        }
        if(keyboard.keyDown(39)) {
            player.dangle += 0.1;
        }
        if(keyboard.keyDown(38)) {
            //player.dx += Math.sin(player.angle)/500;
            //player.dy -= Math.cos(player.angle)/500;
            player.dx += Math.sin(player.angle)*5;
            player.dy -= Math.cos(player.angle)*5;
        }
        gfx.clear();

        for (var i in gameObject.list) {
            if (gameObject.list.hasOwnProperty(i)) {
                var obj = gameObject.list[i];
                obj.refresh();
                gfx.drawSprite(obj);
            }
        }
    },1000/fps);

});