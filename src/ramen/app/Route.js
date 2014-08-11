JSoop.define('Ramen.app.Route', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    isRoute: true,

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);

        if (!me.name) {
            me.name = me.route;
        }

        me.initRoute();
    },

    initRoute: (function () {
        var optionalParam = /\((.*?)\)/g,
            namedParam    = /(\(\?)?:\w+/g,
            splatParam    = /\*\w+/g,
            escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

        return function () {
            var me = this,
                route = me.route;

            if (!JSoop.isRegExp(route)) {
                route = route.replace(escapeRegExp, '\\$&')
                    .replace(optionalParam, '(?:$1)?')
                    .replace(namedParam, function(match, optional) {
                        return optional ? match : '([^/?]+)';
                    })
                    .replace(splatParam, '([^?]*?)');

                me.route = new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
            }
        };
    }()),

    is: function (fragment) {
        var me = this;

        return me.route.test(fragment);
    },

    getParams: function (fragment) {
        var me = this,
            parts = me.route.exec(fragment).slice(1),
            params = [];

        JSoop.each(parts, function (part, index) {
            part = part || null;

            if (index === parts.length - 1) {
                params.push(part);

                return;
            }

            if (part !== null) {
                part = decodeURIComponent(part);
            }

            params.push(part);
        });

        return params;
    }
});
