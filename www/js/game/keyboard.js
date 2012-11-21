define(['jquery','exports'], function ($,exports) {
    var keyStates = {};
    function onKeyboard(e) {
        if(e.type == "keydown") {
            if(!keyStates[e.keyCode]) {
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

    exports.keyDown = function(key) {
        if (keyStates[key]){
            return true;
        } else {
            return false;
        }
    };
});