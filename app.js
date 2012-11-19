var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(3000);

app.use(express.static(__dirname + '/www'));

var connections = {};

io.sockets.on('connection', function (socket) {
    // Generate UUID for the socket. Taken from: http://stackoverflow.com/a/2117523/959919
    socket.uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

    // Add UUID into active connections.
    connections[socket.uuid] = socket;
    console.log("UUID: " + socket.uuid + " connected.");

    // When socket disconnects, delete UUID from active connections.
    socket.on('disconnect', function () {
        delete connections[socket.uuid];
        console.log("UUID: " + socket.uuid + " disconnected.");
    });
});
