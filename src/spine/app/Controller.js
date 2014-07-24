JSoop.define('Spine.app.Controller', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);

        me.queries = {};

        me.controlling = [];

        Spine.view.ViewManager.on('add', me.onViewAdd, me);

        me.initController();
        me.initHelpers();
        me.initRouter();
    },

    initController: JSoop.emptyFn,

    initHelpers: function () {
        var me = this,
            helpers = me.helpers;

        me.helpers = {};

        if (helpers) {
            JSoop.iterate(helpers, function (helper, key) {
                if (JSoop.isString(helper)) {
                    helper = {
                        type: helper
                    };
                }

                helper.owner = me;

                me.helpers[key] = JSoop.create(helper.type, helper);
            });
        }
    },

    initRouter: function () {
        var me = this;

        me.routes = me.routes || {};

        me.router = JSoop.create('Spine.app.Router', {
            listeners: {
                route: me.onRouterRoute,
                scope: me
            }
        });

        JSoop.iterate(me.routes, function (callback, route) {
            me.router.add(route);
        });
    },

    control: function (config) {
        var me = this;

        JSoop.iterate(config, function (events, selector) {
            me.controlling.push({
                selector: selector,
                events: events,
                query: Spine.view.Query.parse(selector)
            });
        });
    },

    onViewAdd: function (manager, views) {
        var me = this;

        JSoop.each(me.controlling, function (control) {
            JSoop.each(views, function (view) {
                if (control.query.is(view)) {
                    view.on(control.events);
                }
            });
        });
    },

    onRouterRoute: function (router, path, route) {
        var me = this,
            callback = me.routes[path],
            scope;

        if (!callback) {
            return;
        }

        if (JSoop.isString(callback)) {
            callback = {
                fn: callback
            };
        }

        JSoop.applyIf(callback, {
            scope: me
        });

        if (JSoop.isString(callback.scope)) {
            callback.scope = me.helpers[callback.scope];
        }

        if (JSoop.isString(callback.fn)) {
            callback.fn = callback.scope[callback.fn];
        }

        return callback.fn.apply(callback.scope, route.getParams(Spine.app.History.getFragment()));
    }
});
