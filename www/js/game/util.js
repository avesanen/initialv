// Generated by CoffeeScript 1.6.2
/*
# Functions that help some common tasks in other JS and CoffeeScript files.
*/


(function() {
  define(["jquery", "exports"], function($, exports) {
    exports.newUUID = function() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r, v;
        r = Math.random() * 16 | 0;
        v = (c === "x" ? r : r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
  });

}).call(this);