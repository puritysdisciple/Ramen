JSoop.define('Spine.data.Query', {
    constructor: function (field, value) {
        var me = this,
            data = field;

        if (!JSoop.isObject(data)) {
            data = {};
            data[field] = value;
        }

        me.data = data;

        me.createFn();
    },

    createFn: function () {
        var me = this,
            fn = [];

        JSoop.iterate(me.data, function (value, field) {
            fn.push('model.get("' + field + '") === data["' + field + '"]');
        });

        me.fn = new Function('model', 'data', 'return ' + fn.join('&&') + ';');
    },

    is: function (model) {
        var me = this;

        return me.fn(model, me.data);
    }
});
