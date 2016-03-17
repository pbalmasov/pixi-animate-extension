"use strict";

/**
 * Data utilities
 * @class DataUtils
 */
var DataUtils = {

    /** 
     * Round a number to decimal places
     * @method toPrecision
     * @param {Number} val Number to round
     * @param {int} [places=2] Number of decimal places to round to
     * @return {Number} Rounded number
     */
    toPrecision: function(val, places)
    {
        places = places || 2;
        const num = Math.pow(10, places); 
        return Math.round(val * num) / num;
    },

    /**
     * Replace the key names with un-quoted strings
     * @method stringifySimple
     * @static
     * @param {Object} json
     * @return {String} Output stringify
     */
    stringifySimple: function(json)
    {
        return JSON.stringify(json, null, '  ')
            .replace(/\"([^(\")"\d]+)\":/g,"$1:");
    },

    /**
     * Convert shapes into readable JSON
     * @static
     * @method readableShapes
     * @param {Object} json
     */
    readableShapes: function(json)
    {
        return JSON.stringify(json).replace("{", "{\n  ")
            .replace("]}", "\n  ]\n}")
            .replace(/\:/g, ': ')
            .replace(/,/g, ', ')
            .replace(/(\"[a-z])/g, "\n    $1")
            .replace(/\],/g, "],\n  ");
    }
};

module.exports = DataUtils;