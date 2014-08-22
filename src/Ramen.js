/**
 * @class Ramen
 * The Ramen namespace encompasses all classes, singletons, and utility methods provided by the framework. Most
 * functionality is nested in other namespaces.
 * @singleton
 */
JSoop.define('Ramen', {
    singleton: true,

    /**
     * @method
     * Generates a unique ID.
     * @param {string} prefix The prefix to add to the ID
     * @return {string} The unique ID
     */
    id: (function () {
        var AUTO_ID = 0;

        return function (prefix) {
            AUTO_ID = AUTO_ID + 1;

            return prefix + '-' + AUTO_ID;
        };
    }())
}, function () {
    //This is here to support backwards compatability
    JSoop.GLOBAL.Spine = Ramen;
});
