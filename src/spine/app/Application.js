JSoop.define('Spine.app.Application', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);

        me.initCollections();
        me.initControllers();

        Spine.app.History.start();

        me.run();
    },

    initCollections: function () {
        var me = this;

        me.collections = me.collections || {};

        JSoop.iterate(me.collections, function (value, key) {
            if (!value.isCollection) {
                value = JSoop.create(value);
            }

            Spine.addCollection(key, value);
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
    Spine.application = function (config) {
        JSoop.create('Spine.app.Application', config);
    };
});
