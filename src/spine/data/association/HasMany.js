JSoop.define('Spine.data.association.HasMany', {
    extend: 'Spine.data.association.Association',

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
            collection;

        if (!model[collectionGetter]) {
            collection = JSoop.create(me.collectionType || 'Spine.data.Collection', [], {
                model: me.model
            });

            model[collectionGetter] = function () {
                return collection;
            };
        } else {
            collection = model[collectionGetter]();
        }

        collection.add(models);

        if (me.globalCollection) {
            Spine.getCollection(me.globalCollection).add(models);
        }
    }
});
