const e = require("express");

var register = function (Handlebars) {
    var helpers = {
        ifElse: function (arg1, arg2, operation, ifTrue, ifFalse) {
            var result;

            switch (operation) {
                case 'exactlyEquals':
                    result = arg1 === arg2;
                    break;
                case 'equals':
                    result = arg1 == arg2;
                    break;
                default:
                    console.log('Please specify a valid operation');
            }

            return result ? ifTrue : ifFalse;
        },
        evenOrOdd: function(index) {
            return index % 2 === 0 ? 'even' : 'odd';
        },
        isOdd: function(index) {
            return index % 2 === 1;
        },
        lightOrDark: function lightOrDark(color) {

            // Variables for red, green, blue values
            var r, g, b, hsp;
            
            // Check the format of the color, HEX or RGB?
            if (color.match(/^rgb/)) {
        
                // If RGB --> store the red, green, blue values in separate variables
                color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
                
                r = color[1];
                g = color[2];
                b = color[3];
            } 
            else {
                
                // If hex --> Convert it to RGB: http://gist.github.com/983661
                color = +("0x" + color.slice(1).replace( 
                color.length < 5 && /./g, '$&$&'));
        
                r = color >> 16;
                g = color >> 8 & 255;
                b = color & 255;
            }
            
            // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
            hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
            );
        
            // Using the HSP value, determine whether the color is light or dark
            if (hsp>127.5) {
        
                return 'light';
            } 
            else {
        
                return 'dark';
            }
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null); 