/**
 * @class Spine.data.Field
 *
 * The Field class is used to parse a value out of data object. It can locate the value, convert its type, and run an
 * arbitrary conversion function to make sure the resulting value is the one that is requested.
 */
JSoop.define('Spine.data.Field', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    config: {
        required: [
            'name'
        ],
        defaults: {
            type: 'auto'
        }
    },

    statics: {
        types: {
            'bool': function (value) {
                return !!value;
            },
            'int': function (value) {
                return parseInt(value, 10);
            },
            'float': function (value) {
                return parseFloat(value);
            },
            'auto': function (value) {
                return value;
            }
        }
    },

    isField: true,

    /**
     * @cfg {String} name (required)
     * The name of the field. This is used by {@link Spine.data.Model} when parsing its data.
     */
    /**
     * @cfg {String} [type="auto"]
     * The type the value needs to be converted to.
     */
    /**
     * @cfg {Function} [convert]
     * An arbitrary function that will be called last. Its return value will be the value the field returns.
     */

    constructor: function (config) {
        var me = this;

        if (!JSoop.isObject(config)) {
            config = {name: config};
        }

        me.initMixin('configurable', [config]);

        if (!me.mapping) {
            me.mapping = me.name;
        }
    },

    read: function (data, model) {
        var me = this,
            value = JSoop.objectQuery(me.mapping, data);

        if (value === undefined && data) {
            value = data[me.name];
        }

        return me.parse(value, data, model);
    },

    /**
     * @method parse
     * Parses a value out of the given data object.
     * @param {Object} data
     * The data object the field is parsing.
     * @param {Spine.data.Model} [model]
     * The model the field is parsing data for.
     * @returns The parsed data value.
     */
    parse: function (value, data, model) {
        var me = this;

        if (value === undefined) {
            value = me.defaultValue;
        }

        value = Spine.data.Field.types[me.type](value);

        if (me.convert) {
            value = me.convert(value, model, data);
        }

        return value;
    }
});
