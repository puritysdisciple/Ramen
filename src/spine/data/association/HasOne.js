JSoop.define('Spine.data.association.HasOne', {
    extend: 'Spine.data.association.Association',

    createModels: function (model, data) {
        data[this.foreignKey] = model.get('id');

        var me = this,
            newModel = me.createModels(data);

        newModel['get' + model.name] = function () {
            return model;
        };

        return newModel;
    },

    assignModels: function (model, models) {
        var me = this;

        model['get' + me.name] = function () {
            return models;
        };
    }
});
