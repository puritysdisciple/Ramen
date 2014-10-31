/**
 * @class Ramen.app.Helper
 * @mixins JSoop.mixins.Configurable
 * @mixins JSoop.mixins.Observable
 */
JSoop.define('Ramen.app.Helper', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable'
    },

    /**
     * Creates a new helper
     * @param {Object} config The config object
     */
    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');

        me.initHelper();
    },

    /**
     * Gets a reference to the Ramen.app.Application that created the parent controller.
     * @returns {Ramen.app.Application}
     */
    getApp: function () {
        return this.owner.app;
    },

    /**
     * @method
     * Called after the config has been applied
     * @template
     */
    initHelper: JSoop.emptyFn
});
