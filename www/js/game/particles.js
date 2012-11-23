/**
 * Particle controller.
 * Usage:
 *  var particles = require('./particles');
 *  particles.init('#particlecanvas');
 */
define(['jquery','exports'], function ($,exports) {
    var canvas = null;
    var ctx = null;
    var lastRefresh = new Date().getTime();
    /**
     * Initialize canvas with the given ID.
     * @param canvasid ID of the canvas to init.
     */
    exports.init = function(canvasid) {
        canvas = $(canvasid)[0];
        ctx = canvas.getContext('2d');
    };

    var particles = [];

    var Particle = function(x,y,angle,speed,life){
        this.x = x;
        this.y = y;
        this.dx = (speed/1000) * Math.cos(angle * Math.PI / 180);
        this.dy = -(speed/1000) * Math.sin(angle * Math.PI / 180);
        this.life = life;
        this.color = [255,0,0,1.0];
    };

    Particle.prototype.refresh = function(dt) {
        this.life -= dt;
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    };

    Particle.prototype.draw = function() {
        ctx.fillStyle = 'rgba('+this.color[0]+', '+this.color[1]+', '+this.color[2]+', '+this.color[3]+')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    };

    exports.emit = function(x,y,angle,speed,life) {
        particles.push(new Particle(x,y,angle,speed,life));
    };

    /**
     * Refresh and draw particles.
     */
    exports.reDraw = function() {
        canvas.width = canvas.width;
        var now = new Date().getTime();
        var dt = now-lastRefresh;
        for(var i = 0; i < particles.length;i++){
            if(particles[i].life > 0) {
                particles[i].refresh(dt);
                particles[i].draw();
            } else {
                // TODO: This is slow?
                particles.splice(i,1);
            }
        }
        lastRefresh = now;
    };

});