/**
 * Particle controller.
 * Usage:
 *  var particles = require('./particles');
 *  particles.init('#particlecanvas');
 */
define(['jquery','exports'], function ($,exports) {
    var canvas = null;
    var ctx = null;

    /**
     * Initialize canvas with the given ID.
     * @param canvasid ID of the canvas to init.
     */
    exports.init = function(canvasid) {
        canvas = $(canvasid)[0];
        ctx = canvas.getContext('2d');
    };

    var toCss = function(A) {
        for(var i=0;i<3;i++){
            A[i]=Math.round(A[i]);
        }
        A[3]/=255;
        return "rgba("+ A.join()+")";
    };

    var lerp = function(p, a, b){
        return Number(a)+(b-a)*p;
    };

    var lerpA = function(p, A, B){
        var res=[]; // fresh array to hold the result color
        // loop as many times as there are components in A
        for(var i=0; i<A.length; i++){
            // lerp same component from each color
            res[i]=lerp(p, A[i], B[i]);
        }
        return res; // return the result color as an array
    };

    var particles = [];

    var Particle = function(x,y,angle,speed,life){
        this.x = x;
        this.y = y;
        this.dx = speed * Math.sin(angle * Math.PI / 180);
        this.dy = -speed * Math.cos(angle * Math.PI / 180);
        this.life = life;
        this.startlife = this.life;
        this.size = 0;
        this.startsize = this.size;
        this.endsize = this.size + 10;

        this.color = [255,0,0,255];
        this.startcolor = this.color;
        this.endcolor = [0,0,0,0.1];


    };

    Particle.prototype.refresh = function(dt) {
        this.life -= dt;
        this.x += this.dx * dt / 1000;
        this.y += this.dy * dt / 1000;
        this.size = lerp(this.life/this.startlife, this.endsize, this.startsize);
        this.color = lerpA(this.life/this.startlife, this.endcolor, this.startcolor);
    };

    Particle.prototype.draw = function() {
        ctx.fillStyle = toCss(this.color);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    };

    /**
     * Particle emitter.
     * @param x X coordinate
     * @param y Y coordinate
     * @param amount Amount of particles to be emitted
     */
    exports.emitter = function(x,y,amount) {
        exports.emit(x,y,Math.random()*360,40,1000);
        setTimeout(function(){
            if (this.attached) {
                console.log("Attached!");
                this.x = this.attached.x;
                this.y = this.attached.y;
            }
            if (amount > 0) {
                amount -= 1;
                exports.emitter(x,y,amount);
            }},1000/30);
    };

    exports.emitter.prototype.attachTo = function(spr) {
        this.attached = spr;
    };

    /**
     * Emit a particle.
     * @param x X-coordinate
     * @param y Y-coordinate
     * @param angle Angle
     * @param speed Speed in pixels/ms
     * @param life Life duration in ms
     */
    exports.emit = function(x,y,angle,speed,life) {
        particles.push(new Particle(x,y,angle,speed,life));
    };

    /**
     * Refresh particle positions and life with delta time.
     * @param dt Delta time
     */
    exports.refresh = function(dt) {
        for(var i = 0; i < particles.length;i++){
            if(particles[i].life > 0) {
                particles[i].refresh(dt);
            } else {
                particles.splice(i,1);
            }
        }
    };

    /**
     * Draw particles.
     */
    exports.reDraw = function() {
        canvas.width = canvas.width;
        for(var i = 0; i < particles.length;i++){
            if(particles[i].life > 0) {
                particles[i].draw();
            } else {
                // TODO: This is slow?
                particles.splice(i,1);
            }
        }
    };

});