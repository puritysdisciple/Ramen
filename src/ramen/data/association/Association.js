/**
 * @class Ramen.data.association.Association
 * @mixins JSoop.mixins.Configurable
 */
JSoop.define('Ramen.data.association.Association', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    config: {
        required: [
            /**
             * @cfg {String} name (required)
             * The name of this association. This will be used to create getters on the parent model.
             */
            'name',
            /**
             * @cfg {String} model (required)
             * The type of model this association will create
             */
            'model',
            /**
             * @cfg {String} mapping (required)
             * The location of the associated data.
             */
            'mapping',
            /**
             * @cfg {String} foreignKey
             * The name of the field that contains the foreign key.
             */
        ]
    },

    /**
     * @cfg {Function/String} prepare
     * A function, or name of a function, that will be used to prepare the data prior to association. If a function name
     * is given, the function will be pulled from the parent model.
     */

    isAssociation: true,

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
    },

    parse: function (model, attributes) {
        var me = this,
            prep, data, models;

        if (me.prepare) {
            prep = me.prepare;

            if (JSoop.isString(prep)) {
                prep = model[prep];
            }

            prep.call(model, attributes);
        }

        data = me.getData(attributes);
        models = me.createModels(model, data);

        me.assignModels(model, models);
    },

    getData: function (attributes) {
        var me = this;

        return JSoop.objectQuery(me.mapping, attributes);
    },

    createModel: function (data) {
        var me = this,
            newModel, existingModel, collection;

        if (data.isModel) {
            return data;
        }

        newModel = JSoop.create(me.model, data);

        if (me.globalCollection) {
            collection = Ramen.getCollection(me.globalCollection);

            if (collection.indexOfKey(newModel.getId()) !== -1) {
                existingModel = collection.get(newModel.getId());
                existingModel.set(newModel.attributes);

                newModel = existingModel;
            }
        }

        return newModel;
    },

    createAssociationChangeListener: function (model) {
        var me = this;

        return function () {
            model.fireEvent('change:association', model, me.name, model['get' + me.name]());
        };
    },

    createModels: JSoop.emptyFn,
    assignModels: JSoop.emptyFn
});
