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

    // Initial values, in case JSON doesn't provide
    this.width = 2000;
    this.height = 2000;
    this.gravityConstant = 0.0981;
    //this.dockList = new Array();

    var that=this;

    /**
     * Initialize canvas with the given ID.
     * @param canvasid ID of the canvas to init.
     */
    exports.init = function(canvasid, sprites) {
        that.canvas = $(canvasid)[0];
        that.ctx = that.canvas.getContext('2d');
        that.sprites = sprites;
    };

    /**
     * Load map from given URL
     * @param mapurl URL for map specificaiton JSON
     */
    exports.loadMap = function(mapurl) {
        $.getJSON(mapurl, function(data) {
            $.each(data, function(key, val) {
                switch(key)
                {
                    case "mapImage":
                        var img = new Image();
                        img.onload = function() {
                            that.ctx.drawImage(img, 0, 0);
                            that.width = img.width;
                            that.height = img.height;
                        };
                        img.src = val;
                        break;
                    case "mapWidth":
                        that.width = val;
                        break;
                    case "mapHeight":
                        that.height = val;
                        break;
                    case "bgImage":
                        maskdiv = document.getElementById("maskdiv");
                        maskdiv.style.backgroundImage = 'url("' + val + '")';
                        break;
                    case "bgWidth":
                        break;
                    case "bgHeight":
                        break;
                    case "gravity":
                        that.gravityConstant = val;
                        break;
                    case "dock":
                        for (var i=0; i<val.length; i++) {
                            var dock = that.sprites.newSprite("img/dock.png", 48, 16, val[i][0], val[i][1], 0, 0, "dock");
                            dock.onCollision = function(dt, target)
                            {
                                if (target.tag == "ship") {
                                    //console.log("docked");
                                    target.docked = true;
                                }
                            }
                        }
                        break;
                    default:
                        console.log("Unknown map key: "+key);
                        break;
                }
            });
        });
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
     * @param r radius
     */
    exports.createCrater = function(center_x, center_y, r) {
        /*that.ctx.fillStyle = "rgba(0,0,0,255)";
        that.ctx.beginPath();
        that.ctx.arc(center_x, center_y, 5, 0, Math.PI * 2, true);
        that.ctx.closePath();
        that.ctx.fill();*/

        // Draw a filled circle which just sets alpha channel to full transparency and color to black
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
