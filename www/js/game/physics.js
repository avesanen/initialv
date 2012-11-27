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
        // A target of collision which simply identifies as the map
        var mapTarget = new Object();
        mapTarget.tag = "map";

        // Work on a copy of the sprite list because onCollision events might modify the real list
        var colList = sprites.spritelist.slice(0);
        for(var i = 0; i < colList.length;i++){
            if (colList[i].onCollision) {
                if(map.getMapCollision(colList[i].x, colList[i].y)) {
                    colList[i].onCollision(dt, mapTarget);
                }
            }
        }
    };

    /**
     * Gravity calculations
     * @param map
     * @param sprites
     * @param dt
     */
    exports.doGravity = function(map, sprites, dt)
    {
        var colList = sprites.spritelist;
        for(var i = 0; i < colList.length;i++){
            // A hack to apply gravity only when the ship is not already stuck or totally still
            // Works because the ship's dy is never exactly 0.00000000000000000 normally :)
            if (sprites.spritelist[i].dy != 0) {
                sprites.spritelist[i].dy += map.gravityConstant * dt;
            }
        }
        //TODO: add support for point-like gravitation too
    }

    /**
     * Calculate new coordinates from a coordinate when some distance and angle is applied
     * (Nice for positioning new bullets outside the ship)
     * @param x
     * @param y
     * @param angle
     * @param distance
     * @return {*} Array of (x,y)
     */
    exports.coordFromAngleDistance = function(x, y, angle, distance)
    {
        res = Array();
        res[0] = x + Math.sin(angle * Math.PI / 180) * distance;
        res[1] = y - Math.cos(angle * Math.PI / 180) * distance;
        return res;
    }
});
