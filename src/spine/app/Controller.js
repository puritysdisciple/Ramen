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
        me.initRouter();
    },

    initController: JSoop.emptyFn,

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
                fn: me[callback]
            };
        }

        scope = callback.scope || me;

        callback.fn.apply(scope, route.getParams(Spine.app.History.getFragment()));
    }
});
