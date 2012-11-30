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
        // also create empty bgm object since we don't initially play music
        this.bgm = new Audio();
        if (/*(new Audio())*/this.bgm.canPlayType("audio/ogg; codecs=vorbis")) {
            this.useExt = ".ogg";
        } else {
            this.useExt = ".mp3";
        }

        this.sfx = Array();
        this.sfxCount = 0;
        this.loadedSfxCount = 0;

        var that = this;

        // Load all sound effects from JSON
        $.getJSON('sfx.json', function(data) {
            $.each(data, function(key, val) {
                //console.log(key + ": " + val);
                that.sfx[key] = new Audio(val + that.useExt);
                that.sfxCount++;
                // .oncanplaythrough= didn't work
                that.sfx[key].addEventListener("canplaythrough", function() {
                    that.loadedSfxCount++;
                    console.log("sfx count: " + that.loadedSfxCount + "/" + that.sfxCount);
                }, false);
            });
        });
    };

    /**
     * Begin playing a background music forever
     * @param basename Base name of the file (no extension or path)
     */
    exports.playBgm = function(basename) {
        // End old music
        this.bgm.pause();
        // Load music reusing old Audio object
        //this.bgm = new Audio("audio/" + basename + this.useExt);
        this.bgm.src = "audio/" + basename + this.useExt;
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
        //console.log("playing sfx: "+number);
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