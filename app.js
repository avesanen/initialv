var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(3002);

app.use(express.static(__dirname + '/www'));

var connections = {};

var games = {};

var newUUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

io.sockets.on('connection', function (socket) {
    // Generate UUID for the socket. Taken from: http://stackoverflow.com/a/2117523/959919
    socket.uuid = newUUID();

    // Add UUID into active connections.
    connections[socket.uuid] = socket;
    console.log("UUID: " + socket.uuid + " connected.");

    socket.emit('player_uuid',{
        uuid:socket.uuid
    });

    io.sockets.emit('obj_sync',{
        uuid: socket.uuid,
        x:100,
        y:100,
        dx:0,
        dy:0,
        angle:0,
        dangle:0,
        width:64,
        height:64
    });

    setInterval(function(){
        io.sockets.emit('req_player',{});
    },100);

    socket.on('obj_sync',function(data){
        socket.broadcast.emit('obj_sync',data);
    });

    // When socket disconnects, delete UUID from active connections.
    socket.on('disconnect', function () {
        io.sockets.emit('del_obj',{uuid:socket.uuid});
        delete connections[socket.uuid];
        console.log("UUID: " + socket.uuid + " disconnected.");
    });
});
