###
# Browser side networking game code
###

define ["jquery", "exports", "socket.io"], ($, exports, io) ->
  # Connect to the server
  socket = io.connect()
  exports.playerUuid = null
  exports.init = (local, remote, map) ->

    # Ask for player and map data
    socket.emit "request_map_data"
    socket.emit "request_player_data"

    socket.on "map_data", (data) ->
      map.loadMap JSON.parse(data)

    socket.on "player_data", (data) ->
      player = JSON.parse(data)
      local[player.uuid] = player
      exports.playerUuid = player.uuid

    # Game sync data which is received frequently during playing
    socket.on "game_sync", (data) ->
      remoteobjs = JSON.parse(data)

      # Basically - update all remotely received game objects from the incoming data
      for i of remoteobjs
        remote[i] = remoteobjs[i]  if remoteobjs.hasOwnProperty(i)

    # TODO: Event data not implemented yet (particles of other players and such)
    socket.on "event", (event) ->

    # Send/update local game objects to the server frequently
    setInterval (->
      socket.emit "client_object_sync", JSON.stringify(local)
    ), 50

  return
