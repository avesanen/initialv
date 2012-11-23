define(['jquery','exports','socket.io','./gameobject'], function ($,exports,io,gameobjects) {
    var socket = io.connect();
    exports.player_uuid = "";

    socket.on('player_uuid',function(data){
        exports.player_uuid = data.uuid;
        console.log('got player uuid: ' + data.uuid);
    });

    socket.on('req_player',function(){
       socket.emit('obj_sync',{
           uuid:gameobjects.list[exports.player_uuid].uuid,
           x:gameobjects.list[exports.player_uuid].x,
           y:gameobjects.list[exports.player_uuid].y,
           dx:gameobjects.list[exports.player_uuid].dx,
           dy:gameobjects.list[exports.player_uuid].dy,
           angle:gameobjects.list[exports.player_uuid].angle,
           dangle:gameobjects.list[exports.player_uuid].dangle,
           width:gameobjects.list[exports.player_uuid].width,
           height:gameobjects.list[exports.player_uuid].height
       });
    });

    socket.on('obj_sync',function(data){
        if(!gameobjects.list[data.uuid]) {
            gameobjects.list[data.uuid] = gameobjects.newGameObject();
            gameobjects.list[data.uuid].img = new Image();
            gameobjects.list[data.uuid].img.src = 'img/ship.png';
        }
        gameobjects.list[data.uuid].uuid = data.uuid;
        gameobjects.list[data.uuid].x = data.x;
        gameobjects.list[data.uuid].y = data.y;
        gameobjects.list[data.uuid].dx = data.dx;
        gameobjects.list[data.uuid].dy = data.dy;
        gameobjects.list[data.uuid].angle = data.angle;
        gameobjects.list[data.uuid].dangle = data.dangle;
        gameobjects.list[data.uuid].height = data.height;
        gameobjects.list[data.uuid].width = data.width;
    });

    socket.on('del_obj', function(data){
        delete gameobjects.list[data.uuid];
    });
});