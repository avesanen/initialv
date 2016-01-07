###
# Image loader. Loads images for animations and caches them in a buffer.
###

define ["jquery", "exports"], ($, exports) ->

  # All images that are in buffer cache
  buffer = {}

  ###
  # Initialize image loader with array of image URLs
  # The array can have many images for one index (sub images for animations)
  #
  # @param images Image URLs in array(s)
  # @param callback
  ###
  exports.imageLoader = (images, callback) ->
    that = this

    callback that.buffer unless images.length

    url = images.shift()
    if url of that.buffer
      that.imageLoader images, callback
      return

    img = new Image()

    img.onload = ->
      that.buffer[url] = img
      that.imageLoader images, callback

    img.onError = ->
      console.error "404: " + url
      that.imageLoader images, callback

    img.src = url

  ###
  # Get image from buffer, or load it to buffer (first time) and get that
  # @param image Usually relative URL to the image
  ###
  exports.getImage = (image) ->
    if buffer[image]
      buffer[image]
    else
      img = new Image()
      buffer[image] = img
      img.src = image
      img

  # this needs to be at the end or coffeescript breaks last exports.someFunction = () thingy.
  return