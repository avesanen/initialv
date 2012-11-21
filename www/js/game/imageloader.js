define(['jquery','exports'], function ($,exports) {

    // TODO: Not tested to be working yet

    exports.imageLoader = function(images,callback) {
        var that = this;
        this.buffer = {};
        if(!images.length) {
            callback(that.buffer);
        }
        var url = images.shift();
        if (url in that.buffer) {
            that.imageLoader(images,callback);
            return;
        }
        var img = new Image();
        img.onload = function() {
            that.buffer[url] = img;
            that.imageLoader(images,callback);
        }
        img.onError = function(){
            console.error("404: "+url);
            that.imageLoader(images,callback);
        };
        img.src = url;
    };
});