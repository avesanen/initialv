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

    /**
     * Sprite constructor
     * @param filename image file
     * @param width width of the sprite
     * @param height height of the sprite
     * @param x initial X-coord
     * @param y initial Y-coord
     * @param angle initial angle
     * @param speed initial speed
     * @param tag some tag, such as "ship" or "bullet", to identify the type of the sprite
     */
    var Sprite = function(filename,width,height,x,y,angle,speed,tag) {
        this.x = x;
        this.y = y;
        this.dx = Math.sin(angle * Math.PI / 180)*speed;
        this.dy = -Math.cos(angle * Math.PI / 180)*speed;
        this.angle = angle;
        this.acceleration = 0;
        this.height = height;
        this.width = width;
        this.img = imageloader.getImage(filename);
        this.tag = tag;
        this.hp = 100; // 100% health at the beginning
        this.visible = true; // sprite is visible by default
        console.log(this.width, this.height);
    };

    Sprite.prototype.refresh = function (dt) {
        if (this.acceleration != 0) {
            this.dx += Math.sin(this.angle * Math.PI / 180) * this.acceleration *dt;
            this.dy -= Math.cos(this.angle * Math.PI / 180) * this.acceleration *dt;
        }
        this.x += this.dx * dt / 1000;
        this.y += this.dy * dt / 1000;
    };

    Sprite.prototype.draw = function() {
        if (!this.visible) return;
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
     * @param filename image file
     * @param width width of the sprite
     * @param height height of the sprite
     * @param x initial X-coord
     * @param y initial Y-coord
     * @param angle initial angle
     * @param speed initial speed
     * @param tag some tag, such as "ship" or "bullet", to identify the type of the sprite
     * @return {Sprite}
     */
    exports.newSprite = function(filename,width,height,x,y,angle,speed,tag) {
        var spr = new Sprite(filename,width,height,x,y,angle,speed,tag);
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

    /**
     * Check if this sprite is colliding with another sprite
     * @return true or false
     */
    Sprite.prototype.checkCollision = function(otherSprite) {
        // radius of circumcircle of a rectangle (a x b) is sqrt(a^2 + b^2) / 2
        thisRadius = Math.sqrt(Math.pow(this.width,2) + Math.pow(this.height,2))/2;
        otherRadius = Math.sqrt(Math.pow(otherSprite.width,2) + Math.pow(otherSprite.height,2))/2;

        // if on both axes the radius of both sprites intersect there is collision
        if ((Math.abs(this.x - otherSprite.x) < thisRadius+otherRadius)
            && (Math.abs(this.y - otherSprite.y) < thisRadius+otherRadius))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * Check collision of every sprite to every sprite
     */
    exports.checkCollision = function(dt) {
        // onCollision functions might alter the sprite list, so we must make a copy of it for iteration
        var iterList = this.spritelist.slice(0);
        for(var i = 0; i < iterList.length; i++) {
            if (typeof iterList[i].onCollision != 'undefined') {
                for (var j = 0; j < iterList.length; j++) {
                    if ((i != j) && (typeof iterList[j] != 'undefined') && iterList[i].checkCollision(iterList[j])) {
                        iterList[i].onCollision(dt, iterList[j]);
                    }
                }
            }
        }
    };

    /**
     * Remove a sprite from spritelist
     * @param sprite
     */
    exports.removeSprite = function(sprite) {
        this.spritelist.splice(this.spritelist.indexOf(sprite), 1);
    }
});