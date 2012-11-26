/**
 * Physics controller.
 * Usage:
 *  var physics = require('./physics');
 *  physics.checkCollision(map, sprites);
 */
define(['jquery','exports'], function ($,exports) {
    var that=this;

    exports.init = function() {};

    /**
     * Check sprite<->map collisions and call sprite's collision callback if needed
     * @param map map
     * @param sprites sprites
     */
    exports.checkCollision = function(map, sprites, dt) {
        var colList = sprites.spritelist;
        for(var i = 0; i < colList.length;i++){
            if (sprites.spritelist[i].onCollision) {
                if(map.getMapCollision(sprites.spritelist[i].x, sprites.spritelist[i].y)) {
                    sprites.spritelist[i].onCollision(dt);
                }
            }
        }
    };


});
