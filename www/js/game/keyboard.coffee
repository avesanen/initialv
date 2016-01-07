###
# A keyboard handler. Supports multiple simultaneous keys in basic
# game programming style.
###

define ["jquery", "exports"], ($, exports) ->
  onKeyboard = (e) ->
    #console.log("Key pressed: "+ e.keyCode);
    keyStates[e.keyCode] = true  unless keyStates[e.keyCode]  if e.type is "keydown"
    keyStates[e.keyCode] = false  if keyStates[e.keyCode]  if e.type is "keyup"

  keyStates = {}

  $(window).bind "keydown", (e) ->
    onKeyboard e

  $(window).bind "keyup", (e) ->
    onKeyboard e

  ###
  # Return true if a key is being held down at the moment
  # @param key keycode
  # @return {Boolean}
  ###
  exports.keyDown = (key) ->
    if keyStates[key]
      true
    else
      false


  ###
  # Force release of a key, so that user has to press it again to have it
  # work again.
  # @param key keycode
  ###
  exports.releaseKey = (key) ->
    keyStates[key] = false

  # this needs to be at the end or coffeescript breaks last exports.someFunction = () thingy.
  return
