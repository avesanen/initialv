var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(3000);

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

    // When socket disconnects, delete UUID from active connections.
    socket.on('disconnect', function () {
        delete connections[socket.uuid];
        console.log("UUID: " + socket.uuid + " disconnected.");
    });
});

var game = function() {
    this.object = {
        uuid: "",
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        sprite: "",
        animation: ""
    };

    this.objects = {};

    var refresh = function() {
        var that = this;
        for (var i in that.objects) {
            if (that.objects.hasOwnProperty(i)) {
                that.objects[i].x += that.objects[i].dx;
                that.objects[i].y += that.objects[i].dy;
            }
        }
    }
};
