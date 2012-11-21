define(['jquery','exports','require'], function ($,exports,require) {

    // TODO: Not tested to be working yet

    var imageLoader = require('./imageloader');

    var loadJson = function(url) {
        xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, false);
        xhttp.send();
        return JSON.parse(xhttp.responseText);
    };

    var spritelist = {};
    var loadSprite = function(url) {
        var images = [];
        var sprites = loadJson(url);
        for (var i in sprites) {
            if (sprites.hasOwnProperty(i)) {
                var sprite = sprites[i];
                for (var a in sprite.animation) {
                    if (sprite.animation.hasOwnProperty(a)) {
                        sprite.animation[a].forEach(function(key){
                            if(images.indexOf(key.file) === -1) {
                                images.push(key.file);
                            }
                        });
                    }
                }
                spritelist[i] = sprite;
            }
        }
    };

    exports.loadSprite = function(url){
        loadSprite(url);
    };
});