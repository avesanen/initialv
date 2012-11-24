/**
 * Sprite controller.
 * Usage:
 *  var sprites = require('./sprites');
 *  sprites.init('#spritecanvas');
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

    var spritelist = [];
    var tempImg = new Image();
    tempImg.onload = function() {
        console.log(this.src + ": " + this.width + 'x' + this.height);
    };
    tempImg.src = '/img/ship.png';

    var Sprite = function(x,y,angle,speed) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.angle = angle;
        this.acceleration = 0;
        this.height = 64;   // TODO:    F
        this.width = 64;    // TODO: <- I
        this.img = tempImg; // TODO:    X
        console.log(this.width, this.height);
    };

    Sprite.prototype.refresh = function (dt) {
        if (this.acceleration != 0) {
            this.dx += Math.sin(this.angle * Math.PI / 180) * this.acceleration;
            this.dy -= Math.cos(this.angle * Math.PI / 180) * this.acceleration;
        }
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    };

    Sprite.prototype.draw = function() {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.rotate(-(this.angle * Math.PI / 180));
        ctx.translate(-this.x, -this.y);
    };

    /**
     * Sprite object creator.
     * @param x
     * @param y
     * @param angle
     * @param speed
     * @return {Sprite}
     */
    exports.newSprite = function(x,y,angle,speed) {
        var spr = new Sprite(x,y,angle,speed);
        spritelist.push(spr);
        return spr;
    };

    /**
     * Refresh sprite positions with given delta time.
     * @param dt
     */
    exports.refresh = function(dt) {
        for(var i = 0; i < spritelist.length;i++){
            spritelist[i].refresh(dt);
        }
    };

    /**
     * Redraw all the sprites.
     */
    exports.reDraw = function() {
        canvas.width = canvas.width;
        for(var i = 0; i < spritelist.length;i++){
            spritelist[i].draw();
        }
    };
});