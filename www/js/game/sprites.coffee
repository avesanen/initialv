###
# Sprite canvas controller (moving game graphics bitmaps).
#
# Usage:
# var sprites = require('./sprites');
# sprites.init('#spritecanvas');
###
define ["jquery", "exports", "require", "./imageloader", "./util"], ($, exports, require, imageloader, util) ->
  canvas = null
  ctx = null
  that = this

  ###
  # Initialize canvas with the given ID.
  # @param canvasid ID of the canvas to init.
  ###
  exports.init = (canvasid) ->
    canvas = $(canvasid)[0]
    ctx = canvas.getContext("2d")

  exports.localSprites = {}
  exports.remoteSprites = {}

  ###
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
  ###
  Sprite = (filename, width, height, x, y, angle, speed, tag, z) ->
    @x = x
    @y = y
    @dx = Math.sin(angle * Math.PI / 180) * speed
    @dy = -Math.cos(angle * Math.PI / 180) * speed
    @ddx = 0
    @ddy = 0
    @a = angle

    #this.acceleration = 0;
    @height = height
    @width = width
    @imgfile = filename
    @tag = tag
    @hp = 100 # 100% health at the beginning
    #this.visible = true; # sprite is visible by default
    @z = z

  # Refresh function, for moving the sprite
  refresh = (spr, dt) ->
    spr.dx += spr.ddx * dt / 1000
    spr.dy += spr.ddy * dt / 1000
    spr.da += spr.dda * dt / 1000
    spr.x += spr.dx * dt / 1000
    spr.y += spr.dy * dt / 1000
    spr.a += spr.da * dt / 1000

  # Drawing function for the sprite (actually draw it to the canvas)
  reDraw = (spr) ->
    ctx.translate spr.x, spr.y
    ctx.rotate spr.a * Math.PI / 180
    ctx.drawImage imageloader.getImage(spr.imgfile), -spr.width / 2, -spr.height / 2, spr.width, spr.height
    ctx.rotate -(spr.a * Math.PI / 180)
    ctx.translate -spr.x, -spr.y

  # Function for removing the sprite
  destroy = (sprite) ->
    # splice won't cut it
    newList = {}
    for spr of exports.localSprites
      newList[spr] = exports.localSprites[spr] unless exports.localSprites[spr] is sprite
    exports.localSprites = newList

  ###
  # Refresh all sprite positions with given delta time.
  # @param dt
  ###
  exports.refresh = (dt) ->
    for i of @remoteSprites
      refresh @remoteSprites[i], dt  if @remoteSprites.hasOwnProperty(i)
    for i of @localSprites
      refresh @localSprites[i], dt  if @localSprites.hasOwnProperty(i)


  ###
  # Redraw all the sprites.
  ###
  exports.reDraw = ->
    # A hack for removing old sprites from the canvas
    canvas.width = canvas.width

    for i of @remoteSprites
      reDraw @remoteSprites[i]  if @remoteSprites.hasOwnProperty(i)
    for i of @localSprites
      reDraw @localSprites[i]  if @localSprites.hasOwnProperty(i)


  ###
  # Destroy a sprite. Can destroy only local sprites (remotes need a network event)
  # @param sprite
  ###
  exports.removeSprite = (sprite) ->
    destroy sprite


  ###
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
  ###
  exports.newSprite = (filename, width, height, x, y, angle, speed, tag, z) ->
    spr = new Sprite(filename, width, height, x, y, angle, speed, tag, z)
    exports.localSprites[util.newUUID()] = spr
    spr


  ###
  # Get total positive speed of the sprite itself
  # @param sprite The sprite
  # @return {Number}
  ###
  exports.getSpeed = (sprite) ->
    Math.abs(sprite.dx) + Math.abs(sprite.dy)


  ###
  # Check if this sprite is colliding with another sprite
  # @param sprite First sprite
  # @param otherSprite Second sprite
  # @return true or false
  ###
  exports.checkCollision = (sprite, otherSprite) ->

    # radius of circumcircle of a rectangle (a x b) is sqrt(a^2 + b^2) / 2
    thisRadius = Math.sqrt(Math.pow(sprite.width, 2) + Math.pow(sprite.height, 2)) / 2
    otherRadius = Math.sqrt(Math.pow(otherSprite.width, 2) + Math.pow(otherSprite.height, 2)) / 2

    # if on both axes the radius of both sprites intersect there is collision
    if (Math.abs(sprite.x - otherSprite.x) < thisRadius + otherRadius) and (Math.abs(sprite.y - otherSprite.y) < thisRadius + otherRadius)
      true
    else
      false


  ###
  # Get list of sprites that are inside the specified area
  # @param x
  # @param y
  # @param radius
  # @param whichList Which list to use. Sprites.localSprites or Sprites.remoteSprites
  # @return {Array}
  ###
  exports.getNearbySprites = (x, y, radius, whichList) ->
    nearbyList = Array()
    for i in [0..whichList.length]
      nearbyList.push whichList[i]  if (Math.abs(whichList[i].x - x) < radius) and (Math.abs(whichList[i].y - y) < radius)
    nearbyList


  return
