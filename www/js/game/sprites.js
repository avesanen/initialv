/**
 * Sprite controller.
 * Usage:
 *  var sprites = require('./sprites');
 *  sprites.init('#spritecanvas');
 */
define(['jquery','exports'], function ($,exports) {
    var canvas = null;
    var ctx = null;
    var lastRefresh = new Date().getTime();
    var spritelist = [];

    var tempImg = new Image();
    tempImg.src = '/img/ship.png';

    /**
     * Initialize canvas with the given ID.
     * @param canvasid ID of the canvas to init.
     */
    exports.init = function(canvasid) {
        canvas = $(canvasid)[0];
        ctx = canvas.getContext('2d');
    };

    var Sprite = function(x,y,angle,speed) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.height = 64;
        this.width = 64;          // TODO: <-- Hardcoded
        this.angle = angle;
        this.acceleration = 0;
        this.img = tempImg;
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

    exports.newSprite = function(x,y,angle,speed) {
        var spr = new Sprite(x,y,angle,speed);
        spritelist.push(spr);
        return spr;
    };

    exports.reDraw = function() {
        canvas.width = canvas.width;
        var now = new Date().getTime();
        var dt = now-lastRefresh;
        for(var i = 0; i < spritelist.length;i++){
            spritelist[i].refresh(dt);
            spritelist[i].draw();
        }
        lastRefresh = now;
    };
});