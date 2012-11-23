/**
 * Game Map controller.
 * Usage:
 *  var map = require('./map');
 *  map.init('#mapcanvas');
 *  map.loadMap('/img/map.png');
 */
define(['jquery','exports'], function ($,exports) {
    var canvas = null;
    var ctx = null;

    /**
     * Initialize canvas with the given ID.
     * @param canvasid ID of the canvas to init.
     */
    exports.init = function(canvasid) {
        canvas = $(canvasid)[0];
        ctx = canvas.getContext('2d');
    };

    /**
     * Load map from given URL
     * @param mapurl URL for map image. Alpha 100% will be trespassable.
     */
    exports.loadMap = function(mapurl) {
        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        };
        img.src = mapurl;
    };
});