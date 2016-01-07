###
# Physics controller.
# Acceleration, gravity, collisions and projectiles.
#
# Usage:
# var physics = require('./physics');
# physics.checkCollision(map, sprites);
###

define ["jquery", "exports"], ($, exports) ->
  @collisionEvents = {}
  that = this

  ###
  # Initialize physics
  ###
  exports.init = -> # Don't have to do anything

  ###
  # A function for creating bullet sprite with just few parameters
  # @param x where to launch from
  # @param y
  # @param dx additional delta
  # @param dy
  # @param angle angle of bullet
  # @param height how far will the bullet be from x,y initially
  # @param sprites sprites
  ###
  exports.createBullet = (x, y, dx, dy, angle, height, sprites) ->
    bulletCoords = exports.coordFromAngleDistance(x, y, angle, height)
    bullet = sprites.newSprite("/img/bullet.png", 4, 4, bulletCoords[0], bulletCoords[1], angle, 300, "bullet", 0)
    bullet.dx += dx
    bullet.dy += dy


  ###
  # Check local sprite<->map collisions and call sprite's collision callback if needed
  # @param map map
  # @param sprites sprites
  # @param dt How much time passed (for frame skip things)
  ###
  exports.checkMapCollision = (map, sprites, dt) ->
    return false if typeof map is "undefined"

    # A target of collision which simply identifies as the map
    mapTarget = {}
    mapTarget.tag = "map"

    # Work on a copy of the sprite list because onCollision events might modify the real list
    sprList = sprites.localSprites
    for spr of sprList
      that.collisionEvents[sprList[spr].tag] sprList[spr], mapTarget, dt  if map.getMapCollision(sprList[spr].x, sprList[spr].y)  unless typeof sprList[spr] is "undefined"


  ###
  # Check collision of every local sprite to every local and remote sprite
  # @param sprites Sprites export which has localSprites, remoteSprites and checkCollision
  # @param dt How much time passed (for frameskip things)
  ###
  exports.checkSpriteCollision = (sprites, dt) ->

    # onCollision functions might alter the sprite list, so we must make a copy of it for iteration
    localList = sprites.localSprites
    remoteList = sprites.remoteSprites
    for i of localList
      unless typeof localList[i] is "undefined"
        for j of localList
          that.collisionEvents[localList[i].tag] localList[i], localList[j], dt  if typeof localList[j] isnt "undefined" and i isnt j and sprites.checkCollision(localList[i], localList[j])
        for j of remoteList
          that.collisionEvents[localList[i].tag] localList[i], remoteList[j], dt  if typeof remoteList[j] isnt "undefined" and sprites.checkCollision(localList[i], remoteList[j])


  ###
  # Gravity calculations
  # @param map
  # @param sprites
  ###
  exports.doGravity = (map, sprites, dt) ->
    sprList = sprites.localSprites
    for spr of sprList

      # A hack to apply gravity only when the ship is not already stuck or totally still
      # Works because the ship's dy is never exactly 0.00000000000000000 normally :)
      sprList[spr].dy += map.gravityConstant * dt / 2  unless sprList[spr].dy is 0


  #TODO: add support for point-like gravitation too

  ###
  # Calculate new coordinates from a coordinate when some distance and angle is applied
  # (Nice for positioning new bullets outside the ship)
  # @param x
  # @param y
  # @param angle
  # @param distance
  # @return {*} Array of (x,y)
  ###
  exports.coordFromAngleDistance = (x, y, angle, distance) ->
    res = []
    res[0] = x + Math.sin(angle * Math.PI / 180) * distance
    res[1] = y - Math.cos(angle * Math.PI / 180) * distance
    res


  ###
  # Accelerate sprite towards it angle
  # @param sprite
  # @param acceleration
  ###
  exports.accelerateSprite = (sprite, acceleration) ->
    sprite.ddx = Math.sin(sprite.a * Math.PI / 180) * acceleration
    sprite.ddy = -Math.cos(sprite.a * Math.PI / 180) * acceleration

  return