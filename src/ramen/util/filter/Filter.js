/**
 * @class Ramen.util.filter.Filter
 * Represents a set of conditions used to filter items.
 * @mixins JSoop.mixins.Configurable
 */
JSoop.define('Ramen.util.filter.Filter', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    /**
     * @param {Object/Function} attributes The attributes to be used in the filter, or a filter function
     * @param {Object} [config] The config object
     */
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

    /**
     * Creates a filter function based on the given attributes.
     * @param {Object} attributes The attributes to compare
     * @returns {Function}
     */
    createFilterFn: function (attributes) {
        var body = [];

        JSoop.iterate(attributes, function (value, key) {
            body.push('item["' + key + '"] === attributes["' + key + '"]');
        });

        body = 'return ' + body.join(' && ') + ';';

        return new Function('item', 'attributes', body);
    },

    /**
     * Checks whether or not the given item matches the filter.
     * @param {Mixed} item The item to test
     * @returns {Boolean}
     */
    is: function (item) {
        var me = this;

        return !!me.fn(item, me.attributes);
    }
});
