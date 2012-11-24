/**
 * Physics controller.
 * Usage:
 *  var physics = require('./physics');
 *  physics.checkCollision(map, sprites);
 */
define(['jquery','exports'], function ($,exports) {
    var that=this;

    /**
     *
     */
    physics.init = function() {

    };

    /**
     * Check collisions
     * @param map map
     * @param sprites sprites
     */
    exports.checkCollision = function(map, sprites) {
        console.log(this + ", " + map + ", " + sprites);
        for (sprite in sprites)
        {
            console.log(map.checkCollision(sprite.x, sprite.y));
        }
    };


});
