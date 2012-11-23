define(['jquery','exports'], function ($,exports) {
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');
    var mapCanvas = $("#mapCanvas")[0];
	var mapCtx = mapCanvas.getContext('2d');
	
    exports.clear = function() {
        // It's a hack, but it's a good hack.
        canvas.width = canvas.width;
    };
	
	/**
	* Draw a sprite to some canvas or the main canvas if none specified
	* @param sprite The sprite object to draw
	* @param mapCanvas Optional parameter. If true, draw to map canvas instead.
	*/
    exports.drawSprite = function(sprite, useMapCanvas) {
		var drawCtx;
		if (useMapCanvas) {
			drawCtx = mapCtx;
		} else {
			drawCtx = ctx;
		}
        drawCtx.translate(sprite.x, sprite.y);
        drawCtx.rotate(sprite.angle);
        drawCtx.drawImage(sprite.img, -sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
        drawCtx.rotate(-sprite.angle);
        drawCtx.translate(-sprite.x, -sprite.y);
    };
	
	/**
	* Draw the map canvas to main canvas
	* @param xScroll
	* @param yScroll
	*/
	exports.drawMap = function(xScroll, yScroll) {
		ctx.drawImage(mapCanvas, -xScroll, -yScroll);
	};
});