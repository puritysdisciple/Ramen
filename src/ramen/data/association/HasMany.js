/**
 * @class Ramen.data.association.HasMany
 * @extends Ramen.data.association.Association
 */
JSoop.define('Ramen.data.association.HasMany', {
    extend: 'Ramen.data.association.Association',

    getData: function () {
        var me = this,
            data = me.callParent(arguments);

        if (!data) {
            data = [];
        }

        return JSoop.toArray(data);
    },

    createModels: function (model, data) {
        var me = this,
            models = [];

        JSoop.each(data, function (item) {
            item[me.foreignKey] = model.get(model.idField);

            var newModel = me.createModel(item);

            newModel['get' + model.name] = function () {
                return model;
            };

            models.push(newModel);
        });

        return models;
    },

    assignModels: function (model, models) {
        var me = this,
            collectionGetter = 'get' + me.name,
            collection, changeListener;

        if (!model[collectionGetter]) {
            collection = JSoop.create(me.collectionType || 'Ramen.data.Collection', [], {
                model: me.model
            });

            model[collectionGetter] = function () {
                return collection;
            };

            changeListener = me.createAssociationChangeListener(model);

            model.mon(collection, {
                add: changeListener,
                remove: changeListener,
                filter: changeListener,
                sort: changeListener,
                scope: model
            });
        } else {
            collection = model[collectionGetter]();
        }

        collection.add(models);

        if (me.globalCollection) {
            Ramen.getCollection(me.globalCollection).add(models);
        }
    }
});
