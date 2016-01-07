##
# Main server side app code
##

express = require("express")
app = express()
server = require("http").createServer(app)
io = require("socket.io").listen(server)
server.listen 3000                            # Port to listen to
io.enable "browser client minification"       # Minimized JSON traffic
io.set "log level", 1                         # Server side log level
refreshrate = 10                              # Refresh rate for game data
connections = {}                              # Client connections
app.use express.static(__dirname + "/www")

# Server side code for generatic new UUIDs
newUUID = ->
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace /[xy]/g, (c) ->
    r = Math.random() * 16 | 0
    v = (if c is "x" then r else (r & 0x3 | 0x8))
    v.toString 16

setInterval (->
  # Go trough all connections
  for i of connections
    if connections.hasOwnProperty(i)
      syncobjs = {}

      # Go trough all connections again...
      for n of connections
        if connections.hasOwnProperty(n)

          # If it's not THIS connection...
          if n isnt i

            # Add all the objects of that connection...
            for j of connections[n].objects

              # To synced objects... allrighty then.
              syncobjs[j] = connections[n].objects[j]  if connections[n].objects.hasOwnProperty(j)

      # And emit it.
      connections[i].socket.emit "game_sync", JSON.stringify(syncobjs)
), 1000 / refreshrate

# Map data of map currently running on the server
# TODO: Load from JSON file like sound effect list is done.
mapdata =
  bgImage: "img/background.jpg"
  mapImage: "img/testmap.png"
  dock: [[600, 305], [980, 135]]
  gravity: 0.0981
  mapWidth: 1280
  mapHeight: 1440
  bgWidth: 640
  bgHeight: 480

# New connection handler
io.sockets.on "connection", (socket) ->

  # Generate new uuid for the socket.
  socket.uuid = newUUID()

  # Init holder object for the connection
  connections[socket.uuid] =
    socket: socket
    objects: {}
    ready: false

  # Client requests data of the player it acommodates
  socket.on "request_player_data", ->
    plr =
      nick: "player"
      uuid: socket.uuid
      x: 400
      y: 100
      a: 0
      dx: 0
      dy: 0
      da: 0
      ddx: 0
      ddy: 0
      dda: 0
      hp: 100
      z: 0
      height: 32
      width: 32
      imgfile: "img/small_ship.png"
      updated: new Date().getTime()
      tag: "player"

    connections[socket.uuid].objects[socket.uuid] = plr
    socket.emit "player_data", JSON.stringify(plr)
    console.log "Synced player data to " + socket.uuid

  # Client requests map data
  socket.on "request_map_data", ->
    socket.emit "map_data", JSON.stringify(mapdata)

  # Client wants to know if server is done loading
  socket.on "loading_done", ->
    connections[socket.uuid].ready = true
    console.log "Client " + socket.uuid + " is ready."

  # Client sends its local game objects
  socket.on "client_object_sync", (data) ->
    connections[socket.uuid].objects = JSON.parse(data)
    connections[socket.uuid].updated = new Date().getTime()

  # Log a new connection
  console.log "UUID: " + socket.uuid + " connected."

  # When socket disconnects, delete UUID from active connections.
  socket.on "disconnect", ->
    io.sockets.emit "del_obj",
      uuid: socket.uuid

    delete connections[socket.uuid]

    # Log a disconnection
    console.log "UUID: " + socket.uuid + " disconnected."

