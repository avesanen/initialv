define(['jquery','exports'], function ($,exports) {

    // TODO: Not tested to be working yet
	var buffer = {};
    exports.imageLoader = function(images,callback) {
        var that = this;
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
	
	exports.getImage = function(image) {
		if (buffer[image]) {
			return buffer[image];
		} else {
			var img = new Image();
			buffer[image] = img;
			img.src = image;
			return img;
		}
	};
});