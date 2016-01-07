###
# Main browser side app file
###
requirejs.config

#By default load any module IDs from js/lib
  baseUrl: "/"
  paths:
    game: "/js/game"
    lib: "/js/lib"
    "socket.io": "socket.io/socket.io"
    jquery: "/js/lib/jquery"

# Start the main app logic.
requirejs ["jquery", "game/game"], ($, game) ->
