define(['jquery','exports'], function ($,exports) {
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');
    exports.clear = function() {
        // It's a hack, but it's a good hack.
        canvas.width = canvas.width;
    };
    exports.drawSprite = function(sprite) {
        ctx.translate(sprite.x, sprite.y);
        ctx.rotate(sprite.angle);
        ctx.drawImage(sprite.img, -sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
        ctx.rotate(-sprite.angle);
        ctx.translate(-sprite.x, -sprite.y);
    };
});