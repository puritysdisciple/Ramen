JSoop.define('Spine.util.filter.Filter', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    constructor: function (attributes, config) {
        var me = this;

        if (arguments.length === 1) {
            if (attributes.fn) {
                config = attributes;
            } else if (JSoop.isFunction(attributes)) {
                config = {
                    fn: attributes
                };
            } else {
                config = {
                    fn: me.createFilterFn(attributes),
                    attributes: attributes
                };
            }
        } else {
            config.attributes = attributes;
        }

        me.initMixin('configurable', [config]);
    },

    createFilterFn: function (attributes) {
        var body = [];

        JSoop.iterate(attributes, function (value, key) {
            body.push('item["' + key + '"] === attributes["' + key + '"]');
        });

        body = 'return ' + body.join(' && ') + ';';

        return new Function('item', 'attributes', body);
    },

    is: function (item) {
        var me = this;

        return !!me.fn(item, me.attributes);
    }
});
