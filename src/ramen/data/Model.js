/**
 * @class Ramen.data.Model
 * A model represents a single set of data.
 */
JSoop.define('Ramen.data.Model', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable'
    },

    config: {
        required: [
            /**
             * @cfg {Ramen.data.Field[]/Object[]} fields (required)
             * An array of field definitions that will be used to parse the data in this model.
             */
            'fields',
            'name'
        ]
    },

    isModel: true,

    /**
     * @cfg {String} [idField="id"]
     * The field that contains a unique id that can be used to identify each model.
     */
    idField: 'id',

    /**
     * @cfg {Ramen.data.Association[]/Object[]} associations
     * An array of association definitions that will be used to parse related data for this model.
     */

    onExtended: function (data, hooks) {
        var onBeforeCreated = hooks.onBeforeCreated;

        hooks.onBeforeCreated = function (data, hooks) {
            var me = this,
                statics = (JSoop.objectQuery('Ramen.data.Model'))? Ramen.data.Model : data.statics;

            onBeforeCreated.call(me, data, hooks);

            statics.initFields.call(me);
            statics.initAssociations.call(me);
        };
    },

    statics: {
        /**
         * @private
         */
        initFields: function () {
            var me = this,
                prototype = (me.prototype)? me.prototype : me.$class.prototype,
                superPrototype = prototype.superClass.prototype,
                protoFields = (prototype.hasOwnProperty('fields'))? prototype.fields : [],
                superFields = superPrototype.fields,
                fields = (superFields)? superFields.slice() : [],
                fieldCache = prototype.fieldCache = {};

            fields = fields.concat(protoFields);

            JSoop.each(fields, function (field, index) {
                if (!field.isField) {
                    field = JSoop.create('Ramen.data.Field', field);
                }

                fieldCache[field.name] = field;
                fields[index] = field;
            });

            prototype.fields = fields;
        },
        /**
         * @private
         */
        initAssociations: function () {
            var me = this,
                prototype = (me.prototype)? me.prototype : me.$class.prototype,
                superPrototype = prototype.superClass.prototype,
                protoAssociations = (prototype.hasOwnProperty('associations'))? prototype.associations : [],
                superAssociations = superPrototype.associations,
                associations = (superAssociations)? superAssociations.slice() : [];

            associations = associations.concat(protoAssociations);

            JSoop.each(associations, function (association, index) {
                var type;

                if (!association.isAssociation) {
                    switch (association.type) {
                        case 'hasMany':
                            type = 'HasMany';
                            break;
                        case 'hasOne':
                            type = 'HasOne';
                            break;
                    }

                    association = JSoop.create('Ramen.data.association.' + type, association);
                }

                associations[index] = association;
            });

            prototype.associations = associations;
        },
        /**
         * @private
         */
        addFields: function (fields) {
            var me = this;

            //calling addFields makes the fields reference local to this model
            me.fields = me.fields.slice();
            me.fieldCache = JSoop.clone(me.fieldCache);

            JSoop.each(fields, function (field) {
                if (!field.isField) {
                    field = JSoop.create('Ramen.data.Field', field);
                }

                me.fields.push(field);
                me.fieldCache[field.name] = field;
            });
        }
    },

    /**
     * @param {Object} [data] The model's initial data.
     * @param {Object} [config] Config options to be applied to the model.
     */
    constructor: function (data, config) {
        var me = this,
            fields;

        if (config) {
            fields = config.fields;

            delete config.fields;
        }

        me.initMixin('configurable', [config]);
        me.initMixin('observable');

        me.attributes = {};

        if (fields) {
            Ramen.data.Model.addFields.call(me, fields);
        }

        if (data) {
            me.set(data);
        }
    },

    /**
     * Retrieves the current value of the specified field.
     * @param {String} field
     * @returns {Mixed} The current value of the field.
     */
    get: function (field) {
        return this.attributes[field];
    },

    /**
     * Retrieves the value idField.
     * @returns {Mixed} The current value of the idField.
     */
    getId: function () {
        var me = this;

        return me.get(me.idField);
    },

    /**
     * Sets the value of one or more fields. The values will be parsed before being set.
     * @param {String/Object} field
     * @param {Mixed} [value]
     */
    set: function (field, value) {
        var me = this,
            data = {},
            attributes = field,
            newValues = {},
            oldValues = {};

        if (!JSoop.isObject(attributes)) {
            attributes = {};
            attributes[field] = value;
        }

        if (me.getId() === undefined && attributes[me.idField] === undefined) {
            //this will trigger the id field parsing if no id exists
            attributes[me.idField] = '';
        }

        attributes = JSoop.apply(JSoop.clone(me.attributes), attributes);

        JSoop.each(me.fields, function (field) {
            var ret = field.read(attributes, me);

            if (ret !== undefined) {
                data[field.name] = ret;
            }
        });

        JSoop.iterate(data, function (value, field) {
            var oldValue = me.get(field);

            me.attributes[field] = value;

            me.fireEvent('change:' + field, me, value, oldValue);

            if (oldValue !== value) {
                oldValues[field] = oldValue;
                newValues[field] = value;
            }
        });

        me.parseAssociations(attributes);

        me.fireEvent('change', me, oldValues, newValues);
    },

    /**
     * @private
     */
    parseAssociations: function (attributes) {
        var me = this,
            associations = me.associations;

        if (!associations) {
            return;
        }

        JSoop.each(associations, function (association) {
            association.parse(me, attributes);
        });
    }
});
