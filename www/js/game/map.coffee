###
# Game Map controller.
#
# Usage:
# var map = require('./gamemap');
# map.init('#mapcanvas');
# map.loadMap('img/map.png');
###

define ["jquery", "exports"], ($, exports) ->
  canvas = undefined
  ctx = undefined
  width = 2000
  height = 2000
  @gravityConstant = 0.2
  that = this

  ###
  # Initialize canvas with the given ID.
  # @param canvasid ID of the canvas to init.
  ###
  exports.init = (canvasid) ->
    that.canvas = $(canvasid)[0]
    that.ctx = that.canvas.getContext("2d")


  ###
  # Load map from given URL
  # @param data map specification JSON
  ###
  exports.loadMap = (data) ->
    if data.hasOwnProperty("mapImage")
      img = new Image()
      img.onload = ->
        that.ctx.drawImage img, 0, 0
        that.width = img.width
        that.height = img.height
      img.src = data["mapImage"]

    that.width = data["mapWidth"]  if data.hasOwnProperty("mapWidth")
    that.height = data["mapHeight"]  if data.hasOwnProperty("mapHeight")

    if data.hasOwnProperty("maskdiv")
      maskdiv = $("#maskdiv")[0]
      maskdiv.style.background = "url(\"" + val + "\")"

    if data.hasOwnProperty("docks")
      docks = data["docks"]
      for i in [0 .. docks.length-1]
        docks.hasOwnProperty(i)
        #TODO: Create docks?

  ###
  # Draw a horizontal line directly to canvas image data
  # The line is completely black and transparent
  # @param x1
  # @param x2
  # @param y
  ###
  exports.drawLine = (x1, x2, y) ->
    width = x2 - x1
    if width > 0
      imgd = that.ctx.createImageData(width, 1)
      j = 0
      while j < width * 4
        imgd.data[j] = 0
        j++
      that.ctx.putImageData imgd, x1, y


  ###
  # Create a crater to the map
  # @param center_x
  # @param center_y
  # @param r radius
  ###
  exports.createCrater = (center_x, center_y, r) ->
    # Draw a filled circle which just sets alpha channel to full transparency and color to black
    x = 0
    y = r

    while x <= y
      exports.drawLine center_x - x, center_x + x, center_y + y
      exports.drawLine center_x - x, center_x + x, center_y - y
      exports.drawLine center_x - y, center_x + y, center_y + x
      exports.drawLine center_x - y, center_x + y, center_y - x
      x++
      y-- if Math.abs(x * x + y * y - r * r) > Math.abs(x * x + (y - 1) * (y - 1) - r * r)


  ###
  # Get collision value from the map canvas at specific coords.
  # Used for bullet/ship <-> map collision detection.
  # @param x
  # @param y
  # @returns true or false
  ###
  exports.getMapCollision = (x, y) ->
    return true if x < 0 or y < 0 or x > that.canvas.width or y > that.canvas.height

    pixel = that.ctx.getImageData(x, y, 1, 1)

    # data has 4 indexes - R, G, B, A
    #console.log('RGBA = '+pixel.data[0]+', '+pixel.data[1]+', '+pixel.data[2]+', '+pixel.data[3]);

    # If pixel is not transparent and it's not black then it is wall
    if (pixel.data[3] > 0) and ((pixel.data[2] > 0) or (pixel.data[1] > 0) or (pixel.data[0] > 0))
      true
    else
      false

  # this needs to be at the end or coffeescript breaks last exports.someFunction = () thingy.
  return