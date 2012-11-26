/**
 * Sprite controller.
 * Usage:
 *  var sprites = require('./sprites');
 *  sprites.init('#spritecanvas');
 */
define(['jquery','exports', 'require','./imageloader'], function ($,exports,require,imageloader) {
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

    exports.spritelist = [];

    var Sprite = function(filename,width,height,x,y,angle,speed) {
        this.x = x;
        this.y = y;
        this.dx = Math.sin(angle * Math.PI / 180)*speed;
        this.dy = -Math.cos(angle * Math.PI / 180)*speed;
        this.angle = angle;
        this.acceleration = 0;
        this.height = height;
        this.width = width;
        this.img = imageloader.getImage(filename);
        console.log(this.width, this.height);
    };

    Sprite.prototype.refresh = function (dt) {
        if (this.acceleration != 0) {
            this.dx += Math.sin(this.angle * Math.PI / 180) * this.acceleration;
            this.dy -= Math.cos(this.angle * Math.PI / 180) * this.acceleration;
        }
        this.x += this.dx * dt / 1000;
        this.y += this.dy * dt / 1000;
    };

    Sprite.prototype.draw = function() {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.rotate(-(this.angle * Math.PI / 180));
        ctx.translate(-this.x, -this.y);
    };

    Sprite.prototype.destroy = function() {
        for(var i = 0; i < exports.spritelist.length;i++){
            if(exports.spritelist[i] == this) {
                exports.spritelist.splice(i,1);
            }
        }
    };

    /**
     * Sprite object creator.
     * @param x
     * @param y
     * @param angle
     * @param speed
     * @return {Sprite}
     */
    exports.newSprite = function(filename,width,height,x,y,angle,speed) {
        var spr = new Sprite(filename,width,height,x,y,angle,speed);
        this.spritelist.push(spr);
        return spr;
    };

    /**
     * Refresh sprite positions with given delta time.
     * @param dt
     */
    exports.refresh = function(dt) {
        for(var i = 0; i < this.spritelist.length;i++){
            this.spritelist[i].refresh(dt);
        }
    };

    /**
     * Redraw all the sprites.
     */
    exports.reDraw = function() {
        canvas.width = canvas.width;
        for(var i = 0; i < this.spritelist.length;i++){
            this.spritelist[i].draw();
        }
    };

    /**
     * Get total positive speed of the sprite itself
     * @return {Number}
     */
    Sprite.prototype.getSpeed = function() {
        return Math.abs(this.dx)+Math.abs(this.dy);
    }
	

});