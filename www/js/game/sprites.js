// Generated by CoffeeScript 1.6.2
/*
# Sprite canvas controller (moving game graphics bitmaps).
#
# Usage:
# var sprites = require('./sprites');
# sprites.init('#spritecanvas');
*/


(function() {
  define(["jquery", "exports", "require", "./imageloader", "./util"], function($, exports, require, imageloader, util) {
    var Sprite, canvas, ctx, destroy, reDraw, refresh, that;
    canvas = null;
    ctx = null;
    that = this;
    /*
    # Initialize canvas with the given ID.
    # @param canvasid ID of the canvas to init.
    */

    exports.init = function(canvasid) {
      canvas = $(canvasid)[0];
      return ctx = canvas.getContext("2d");
    };
    exports.localSprites = {};
    exports.remoteSprites = {};
    /*
    # Sprite constructor for new sprite
    # @param filename image file
    # @param width width of the sprite
    # @param height height of the sprite
    # @param x initial X-coord
    # @param y initial Y-coord
    # @param angle initial angle
    # @param speed initial speed
    # @param tag some tag, such as "ship" or "bullet", to identify the type of the sprite
    # @param z ordering, if some sprites have to be drawn on background (first) or foreground (last)
    */

    Sprite = function(filename, width, height, x, y, angle, speed, tag, z) {
      this.x = x;
      this.y = y;
      this.dx = Math.sin(angle * Math.PI / 180) * speed;
      this.dy = -Math.cos(angle * Math.PI / 180) * speed;
      this.ddx = 0;
      this.ddy = 0;
      this.a = angle;
      this.height = height;
      this.width = width;
      this.imgfile = filename;
      this.tag = tag;
      this.hp = 100;
      return this.z = z;
    };
    refresh = function(spr, dt) {
      spr.dx += spr.ddx * dt / 1000;
      spr.dy += spr.ddy * dt / 1000;
      spr.da += spr.dda * dt / 1000;
      spr.x += spr.dx * dt / 1000;
      spr.y += spr.dy * dt / 1000;
      return spr.a += spr.da * dt / 1000;
    };
    reDraw = function(spr) {
      ctx.translate(spr.x, spr.y);
      ctx.rotate(spr.a * Math.PI / 180);
      ctx.drawImage(imageloader.getImage(spr.imgfile), -spr.width / 2, -spr.height / 2, spr.width, spr.height);
      ctx.rotate(-(spr.a * Math.PI / 180));
      return ctx.translate(-spr.x, -spr.y);
    };
    destroy = function(sprite) {
      var newList, spr;
      newList = {};
      for (spr in exports.localSprites) {
        if (exports.localSprites[spr] !== sprite) {
          newList[spr] = exports.localSprites[spr];
        }
      }
      return exports.localSprites = newList;
    };
    /*
    # Refresh all sprite positions with given delta time.
    # @param dt
    */

    exports.refresh = function(dt) {
      var i, _results;
      for (i in this.remoteSprites) {
        if (this.remoteSprites.hasOwnProperty(i)) {
          refresh(this.remoteSprites[i], dt);
        }
      }
      _results = [];
      for (i in this.localSprites) {
        if (this.localSprites.hasOwnProperty(i)) {
          _results.push(refresh(this.localSprites[i], dt));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    /*
    # Redraw all the sprites.
    */

    exports.reDraw = function() {
      var i, _results;
      canvas.width = canvas.width;
      for (i in this.remoteSprites) {
        if (this.remoteSprites.hasOwnProperty(i)) {
          reDraw(this.remoteSprites[i]);
        }
      }
      _results = [];
      for (i in this.localSprites) {
        if (this.localSprites.hasOwnProperty(i)) {
          _results.push(reDraw(this.localSprites[i]));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    /*
    # Destroy a sprite. Can destroy only local sprites (remotes need a network event)
    # @param sprite
    */

    exports.removeSprite = function(sprite) {
      return destroy(sprite);
    };
    /*
    # Sprite object creator for local sprites.
    # @param filename image file
    # @param width width of the sprite
    # @param height height of the sprite
    # @param x initial X-coord
    # @param y initial Y-coord
    # @param angle initial angle
    # @param speed initial speed
    # @param tag some tag, such as "ship" or "bullet", to identify the type of the sprite
    # @param z ordering, if some sprites have to be drawn on background (first) or foreground (last)
    # @return {Sprite}
    */

    exports.newSprite = function(filename, width, height, x, y, angle, speed, tag, z) {
      var spr;
      spr = new Sprite(filename, width, height, x, y, angle, speed, tag, z);
      exports.localSprites[util.newUUID()] = spr;
      return spr;
    };
    /*
    # Get total positive speed of the sprite itself
    # @param sprite The sprite
    # @return {Number}
    */

    exports.getSpeed = function(sprite) {
      return Math.abs(sprite.dx) + Math.abs(sprite.dy);
    };
    /*
    # Check if this sprite is colliding with another sprite
    # @param sprite First sprite
    # @param otherSprite Second sprite
    # @return true or false
    */

    exports.checkCollision = function(sprite, otherSprite) {
      var otherRadius, thisRadius;
      thisRadius = Math.sqrt(Math.pow(sprite.width, 2) + Math.pow(sprite.height, 2)) / 2;
      otherRadius = Math.sqrt(Math.pow(otherSprite.width, 2) + Math.pow(otherSprite.height, 2)) / 2;
      if ((Math.abs(sprite.x - otherSprite.x) < thisRadius + otherRadius) && (Math.abs(sprite.y - otherSprite.y) < thisRadius + otherRadius)) {
        return true;
      } else {
        return false;
      }
    };
    /*
    # Get list of sprites that are inside the specified area
    # @param x
    # @param y
    # @param radius
    # @param whichList Which list to use. Sprites.localSprites or Sprites.remoteSprites
    # @return {Array}
    */

    exports.getNearbySprites = function(x, y, radius, whichList) {
      var i, nearbyList, _i, _ref;
      nearbyList = Array();
      for (i = _i = 0, _ref = whichList.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if ((Math.abs(whichList[i].x - x) < radius) && (Math.abs(whichList[i].y - y) < radius)) {
          nearbyList.push(whichList[i]);
        }
      }
      return nearbyList;
    };
  });

}).call(this);
