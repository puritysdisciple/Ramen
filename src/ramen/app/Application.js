JSoop.define('Ramen.app.Application', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);

        me.initCollections();
        me.initControllers();

        me.run();

        Ramen.app.History.start();
    },

    initCollections: function () {
        var me = this;

        me.collections = me.collections || {};

        JSoop.iterate(me.collections, function (value, key) {
            if (!value.isCollection) {
                value = JSoop.create(value);
            }

            Ramen.addCollection(key, value);
        });
    },

    initControllers: function () {
        var me = this;

        me.controllers = me.controllers || {};

        JSoop.iterate(me.controllers, function (value, key) {
            if (JSoop.isString(value)) {
                value = {
                    type: value
                };
            }

            value.app = me;

            me.controllers[key] = JSoop.create(value.type, value);
        });
    },

    run: JSoop.emptyFn
}, function () {
    Ramen.application = function (config) {
        if (config.requires) {
            JSoop.Loader.require(config.requires);
        }

        JSoop.create('Ramen.app.Application', config);
    };
});
