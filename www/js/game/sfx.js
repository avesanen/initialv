/**
 * Created with JetBrains WebStorm.
 * User: wind
 * Date: 23.11.2012
 * Time: 14:44
 * To change this template use File | Settings | File Templates.
 */
define(['jquery','exports'], function ($,exports) {

    /**
     * "Constructor"
     */
    exports.init = function() {
        // Figure out which extension (codec) to use for the browser
        if ((new Audio()).canPlayType("audio/ogg; codecs=vorbis")) {
            this.useExt = ".ogg";
        } else {
            this.useExt = ".mp3";
        }

        // Load all sound effects
        this.sfx = new Array();
        this.sfx["thruster"] = new Audio("audio/thruster" + this.useExt); // Sound of thrusting with up arrow
        this.sfx["laser"] = new Audio("audio/laser" + this.useExt); // Sound of shooting with spacebar
        this.sfx["ground_hit"] = new Audio("audio/ground_hit" + this.useExt); // A bullet hits ground
        this.sfx["ship_hit"] = new Audio("audio/ship_hit" + this.useExt); // A ship hits with something
    };

    /**
     * Begin playing a background music forever
     * @param basename Base name of the file (no extension or path)
     */
    exports.playBgm = function(basename) {
        // Load music
        this.bgm = new Audio("audio/" + basename + this.useExt);
        // Loop the music in FireFox compatible way
        this.bgm.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        // Play the music
        this.bgm.play();
    };

    /**
     * Stop playing the background music
     */
    exports.stopBgm = function() {
        this.bgm.stop();
    };

    /**
     * Play a preloaded sound effect
     * @param number Index of the sound effect
     */
    exports.playSfx = function(number) {
        console.log("playing sfx: "+number);
        if (this.sfx[number].currentTime > 0)
        {
            this.sfx[number].pause();
            this.sfx[number].currentTime=0;
        }
        this.sfx[number].play();
    }

    /**
     * Stop playing a preloaded sound effect
     * @param number
     */
    exports.stopSfx = function(number) {
        this.sfx[number].pause();
    }
});