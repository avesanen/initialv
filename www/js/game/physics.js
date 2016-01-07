// Generated by CoffeeScript 1.6.2
/*
# Physics controller.
# Acceleration, gravity, collisions and projectiles.
#
# Usage:
# var physics = require('./physics');
# physics.checkCollision(map, sprites);
*/


(function() {
  define(["jquery", "exports"], function($, exports) {
    var that;
    this.collisionEvents = {};
    that = this;
    /*
    # Initialize physics
    */

    exports.init = function() {};
    /*
    # A function for creating bullet sprite with just few parameters
    # @param x where to launch from
    # @param y
    # @param dx additional delta
    # @param dy
    # @param angle angle of bullet
    # @param height how far will the bullet be from x,y initially
    # @param sprites sprites
    */

    exports.createBullet = function(x, y, dx, dy, angle, height, sprites) {
      var bullet, bulletCoords;
      bulletCoords = exports.coordFromAngleDistance(x, y, angle, height);
      bullet = sprites.newSprite("/img/bullet.png", 4, 4, bulletCoords[0], bulletCoords[1], angle, 300, "bullet", 0);
      bullet.dx += dx;
      return bullet.dy += dy;
    };
    /*
    # Check local sprite<->map collisions and call sprite's collision callback if needed
    # @param map map
    # @param sprites sprites
    # @param dt How much time passed (for frame skip things)
    */

    exports.checkMapCollision = function(map, sprites, dt) {
      var mapTarget, spr, sprList, _results;
      if (typeof map === "undefined") {
        return false;
      }
      mapTarget = {};
      mapTarget.tag = "map";
      sprList = sprites.localSprites;
      _results = [];
      for (spr in sprList) {
        if (typeof sprList[spr] !== "undefined" ? map.getMapCollision(sprList[spr].x, sprList[spr].y) : void 0) {
          _results.push(that.collisionEvents[sprList[spr].tag](sprList[spr], mapTarget, dt));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    /*
    # Check collision of every local sprite to every local and remote sprite
    # @param sprites Sprites export which has localSprites, remoteSprites and checkCollision
    # @param dt How much time passed (for frameskip things)
    */

    exports.checkSpriteCollision = function(sprites, dt) {
      var i, j, localList, remoteList, _results;
      localList = sprites.localSprites;
      remoteList = sprites.remoteSprites;
      _results = [];
      for (i in localList) {
        if (typeof localList[i] !== "undefined") {
          for (j in localList) {
            if (typeof localList[j] !== "undefined" && i !== j && sprites.checkCollision(localList[i], localList[j])) {
              that.collisionEvents[localList[i].tag](localList[i], localList[j], dt);
            }
          }
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (j in remoteList) {
              if (typeof remoteList[j] !== "undefined" && sprites.checkCollision(localList[i], remoteList[j])) {
                _results1.push(that.collisionEvents[localList[i].tag](localList[i], remoteList[j], dt));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          })());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    /*
    # Gravity calculations
    # @param map
    # @param sprites
    */

    exports.doGravity = function(map, sprites, dt) {
      var spr, sprList, _results;
      sprList = sprites.localSprites;
      _results = [];
      for (spr in sprList) {
        if (sprList[spr].dy !== 0) {
          _results.push(sprList[spr].dy += map.gravityConstant * dt / 2);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    /*
    # Calculate new coordinates from a coordinate when some distance and angle is applied
    # (Nice for positioning new bullets outside the ship)
    # @param x
    # @param y
    # @param angle
    # @param distance
    # @return {*} Array of (x,y)
    */

    exports.coordFromAngleDistance = function(x, y, angle, distance) {
      var res;
      res = [];
      res[0] = x + Math.sin(angle * Math.PI / 180) * distance;
      res[1] = y - Math.cos(angle * Math.PI / 180) * distance;
      return res;
    };
    /*
    # Accelerate sprite towards it angle
    # @param sprite
    # @param acceleration
    */

    exports.accelerateSprite = function(sprite, acceleration) {
      sprite.ddx = Math.sin(sprite.a * Math.PI / 180) * acceleration;
      return sprite.ddy = -Math.cos(sprite.a * Math.PI / 180) * acceleration;
    };
  });

}).call(this);
