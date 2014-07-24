JSoop.define('Spine.app.Router', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable'
    },

    isRouter: true,

    constructor: function (config) {
        var me = this,
            routes;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');

        routes = me.routes;
        me.routes = {};

        if (JSoop.isArray(routes)) {
            JSoop.each(routes, function (route) {
                me.add(route);
            });
        }

        me.initRouter();

        Spine.app.History.on('change', me.onHistoryChange, me);
    },

    initRouter: JSoop.emptyFn,

    add: function (route) {
        var me = this,
            fragment = Spine.app.History.getFragment();

        if (JSoop.isString(route)) {
            route = {
                route: route
            };
        }

        if (!route.isRoute) {
            JSoop.applyIf(route, {
                type: 'Spine.app.Route'
            });

            route = JSoop.create(route.type, route);
        }

        me.routes[route.name] = route;

        if (route.is(fragment)) {
            me.fireEvent('route', route.route, route);
        }
    },

    remove: function (name) {
        delete this.routes[name];
    },

    onHistoryChange: function (fragment) {
        var me = this,
            routed = false;

        JSoop.iterate(me.routes, function (route, path) {
            if (route.is(fragment)) {
                if (me.fireEvent('route', me, path, route) === false) {
                    routed = true;

                    return false;
                }
            }
        });

        if (routed) {
            return false;
        }
    }
});
