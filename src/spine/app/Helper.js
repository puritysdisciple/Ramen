JSoop.define('Spine.app.Helper', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable'
    },

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');

        me.initHelper();
    },

    initHelper: JSoop.emptyFn
});
