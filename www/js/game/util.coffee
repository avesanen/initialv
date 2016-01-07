###
# Functions that help some common tasks in other JS and CoffeeScript files.
###

define ["jquery", "exports"], ($, exports) ->
  exports.newUUID = ->
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace /[xy]/g, (c) ->
      r = Math.random() * 16 | 0
      v = (if c is "x" then r else (r & 0x3 | 0x8))
      v.toString 16

  return
