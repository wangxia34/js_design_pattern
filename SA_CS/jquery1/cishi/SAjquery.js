(function (global, factory) {
    
    "use strict";
    
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }

})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
    
    "use strict";
    
    let jQuery = function (selector, context) {
            return new jQuery.fn.init(selector, context);
        };
    
    jQuery.fn = jQuery.prototype = {
        
        jquery: version,
        
        constructor: jQuery,
    };
    
    jQuery.extend = jQuery.fn.extend = function () {
    
    
    };
    
    
    let init = jQuery.fn.init = function (selector, context, root) {
    
    
    
        return jQuery.makeArray(selector, this);
    };
    
    
    
    
    
    
    
    
    
    
    if (!noGlobal) {
        window.jQuery = window.$ = jQuery;
    }
    
    return jQuery;
    
});