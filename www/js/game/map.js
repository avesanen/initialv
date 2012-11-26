/**
 * Game Map controller.
 * Usage:
 *  var map = require('./gamemap');
 *  map.init('#mapcanvas');
 *  map.loadMap('img/map.png');
 */
define(['jquery','exports'], function ($,exports) {
    var canvas;
    var ctx;
    var width = 2000;
    var height = 2000;
    var that=this;

    /**
     * Initialize canvas with the given ID.
     * @param canvasid ID of the canvas to init.
     */
    exports.init = function(canvasid) {
        that.canvas = $(canvasid)[0];
        that.ctx = that.canvas.getContext('2d');
    };

    /**
     * Load map from given URL
     * @param mapurl URL for map image. Alpha 100% will be trespassable.
     */
    exports.loadMap = function(mapurl) {
        var img = new Image();
        img.onload = function() {
            that.ctx.drawImage(img, 0, 0);
            that.width = img.width;
            that.height = img.height;
        };
        img.src = mapurl;
    };

    /**
     * Draw a horizontal line directly to canvas image data
     * The line is completely black and transparent
     * @param x1
     * @param x2
     * @param y
     */
    exports.drawLine = function(x1, x2, y) {
        var width = x2 - x1;
        if (width > 0)
        {
            imgd = that.ctx.createImageData(width, 1);
            for (j=0; j<width*4; j++)
             {
                imgd.data[j]=0;
             }
             that.ctx.putImageData(imgd, x1, y);
        }
    };

    /**
     * Create a crater to the map
     * @param center_x
     * @param center_y
     */
    exports.createCrater = function(center_x, center_y) {
        /*that.ctx.fillStyle = "rgba(0,0,0,255)";
        that.ctx.beginPath();
        that.ctx.arc(center_x, center_y, 5, 0, Math.PI * 2, true);
        that.ctx.closePath();
        that.ctx.fill();*/

        // Draw a filled circle which just sets alpha channel to full transparency and color to black
        r = 32;
        x = 0, y = r;
        while (x <= y)
        {
            exports.drawLine(center_x - x, center_x + x, center_y + y);
            exports.drawLine(center_x - x, center_x + x, center_y - y);
            exports.drawLine(center_x - y, center_x + y, center_y + x);
            exports.drawLine(center_x - y, center_x + y, center_y - x);

            x++;
            if (Math.abs (x*x + y*y - r*r) > Math.abs (x*x + (y-1)*(y-1) - r*r)) y--;
        }
    };

    /**
     * Get collision value from the map canvas at specific coords
     * Used for bullet/ship <-> map collision detection
     * @param x
     * @param y
     * @returns true or false
     */
    exports.getMapCollision = function(x, y) {
        if(x<0 || y<0 || x>that.canvas.width || y>that.canvas.height) return true;
        pixel = that.ctx.getImageData(x, y, 1, 1);
        // data has 4 indexes - R, G, B, A
        //console.log('RGBA = '+pixel.data[0]+', '+pixel.data[1]+', '+pixel.data[2]+', '+pixel.data[3]);
        // If pixel is not transparent and it's not black then it is wall
        if ((pixel.data[3]>0) && ((pixel.data[2]>0) || (pixel.data[1]>0) || (pixel.data[0]>0))) {
            return true;
        } else {
            return false;
        }
    };
});
