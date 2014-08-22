/**
 * @class Ramen.data.association.HasOne
 * @extends Ramen.data.association.Association
 */
JSoop.define('Ramen.data.association.HasOne', {
    extend: 'Ramen.data.association.Association',

    createModels: function (model, data) {
        var me = this,
            newModel;

        if (!data) {
            if (model['get' + me.name]) {
                data = model['get' + me.name]().attributes;
            } else {
                data = {};
            }
        }

        data[me.foreignKey] = model.get('id');

        newModel = me.createModel(data);

        return newModel;
    },

    assignModels: function (model, models) {
        var me = this,
            getter = 'get' + me.name,
            old;

        if (model[getter]) {
            old = model['get' + me.name]();
        }

        model[getter] = function () {
            return models;
        };

        if (old) {
            model.moff(old, 'change');
        }

        model.mon(models, 'change', me.createAssociationChangeListener(model), model);
    }
});
