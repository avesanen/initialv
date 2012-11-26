define(['jquery','exports'], function ($,exports) {
    var keyStates = {};
    function onKeyboard(e) {
        if(e.type == "keydown") {
            if(!keyStates[e.keyCode]) {
                console.log("Key pressed: "+ e.keyCode);
                keyStates[e.keyCode] = true;
            }
        }
        if(e.type == "keyup") {
            if(keyStates[e.keyCode]){
                keyStates[e.keyCode] = false;
            }
        }
    }

    $(window).bind('keydown',function(e){
        onKeyboard(e);
    });

    $(window).bind('keyup',function(e){
        onKeyboard(e);
    });

    /**
     * Return true if a key is being held down at the moment
     * @param key keycode
     * @return {Boolean}
     */
    exports.keyDown = function(key) {
        if (keyStates[key]){
            return true;
        } else {
            return false;
        }
    };

    /**
     * "Release" a key, so that user has to press it again to have it true
     * @param key keycode
     */
    exports.releaseKey = function(key) {
        keyStates[key]=false;
    }
});