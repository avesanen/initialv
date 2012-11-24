/**
 * Sprite controller.
 * Usage:
 *  var sprites = require('./sprites');
 *  sprites.init('#spritecanvas');
 */
define(['jquery','exports','require'], function ($,exports,require) {
    //var mapObject = require('./map');

    var canvas = null;
    var ctx = null;
    var lastRefresh = new Date().getTime();
    var spritelist = [];
    var tempImg = new Image();
    var that=this;

    tempImg.onload = function() {
        //TODO: how to get this working to avoid hardcode below?
        //alert(this.width+'x'+this.height);
        //exports.width = tempImg.width;
        //exports.height = tempImg.height;
        //alert(exports.width+'x'+exports.height);
    }
    tempImg.src = '/img/ship.png';

    /**
     * Initialize canvas with the given ID.
     * @param canvasid ID of the canvas to init.
     */
    exports.init = function(canvasid) {
        canvas = $(canvasid)[0];
        ctx = canvas.getContext('2d');
    };

    /**
     * Initialize sprite
     * @param x starting coord
     * @param y starting coord
     * @param angle starting angle
     * @param speed starting speed
     * @param mapObject give map object if sprite can collide with it
     * @constructor
     */
    var Sprite = function(x,y,angle,speed,mapObjectParam) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.height = 64;
        this.width = 64;          // TODO: <-- Hardcoded
        this.angle = angle;
        this.acceleration = 0;
        this.img = tempImg;
        //if (typeof mapObjectParam != 'undefined') console.log("Has map");
        //this.mapObject = mapObjectParam;
    };

    Sprite.prototype.refresh = function (dt) {
        old_dx = this.dx;
        old_dy = this.dy;
        old_x = this.x;
        old_y = this.y;
        if (this.acceleration != 0) {
            this.dx += Math.sin(this.angle * Math.PI / 180) * this.acceleration;
            this.dy -= Math.cos(this.angle * Math.PI / 180) * this.acceleration;
        }
        this.x += this.dx * dt;
        this.y += this.dy * dt;
        /*if (typeof this.mapObject!='undefined')
        {*/
            //console.log("Has map");
            /*if (map.getMapCollision(this.x, this.y))
            {
                this.x = old_x;
                this.y = old_y;
                this.dx = -old_dx / 2;
                this.dy = -old_dy / 2;
            }*/
        //}
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