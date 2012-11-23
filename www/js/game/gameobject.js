define(['jquery','exports','require'], function ($,exports,require) {
    exports.list = {};
    exports.newGameObject = function() {
        return new function() {
            this.x = 0;
            this.y = 0;
            this.dx = 0;
            this.dy = 0;
            this.width = 0;
            this.height = 0;
            this.angle = 0;
            this.dangle = 0;
            this.img = new Image();

            var lastRefresh = new Date();

            this.refresh = function() {
                var that = this;
                var currentTime = new Date();
                that.x += that.dx * (currentTime-lastRefresh)/1000;
                that.y += that.dy * (currentTime-lastRefresh)/1000;
                that.angle += that.dangle * (currentTime-lastRefresh)/1000;
                lastRefresh = currentTime;
            }
        };
    };
    exports.loadImage = function(filename) {
        /*this.img.onLoad = function () {
            this.count++;
            this.width = this.img.width;
            this.height = this.img.height;
        };*/
        this.img.src = "img/" + filename;

    };
});