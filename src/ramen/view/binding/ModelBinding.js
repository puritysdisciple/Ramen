/**
 * @class Ramen.view.binding.ModelBinding
 * @extends Ramen.view.binding.Binding
 */
JSoop.define('Ramen.view.binding.ModelBinding', {
    extend: 'Ramen.view.binding.Binding',

    isModelBinding: true,

    watchingFields: null,
    watchingAssociations: null,

    initBinding: function () {
        var me = this;

        if (me.field) {
            me.formatter = new Function('model', 'return model.get("' + me.field + '");');
        }

        me.parseWatchers();

        me.mon(me.model, 'change', me.onChange, me);
        me.mon(me.model, 'change:association', me.onAssociationChange, me);
    },

    parseWatchers: function () {
        var me = this,
            watching = [],
            fn = me.formatter.toString(),
            parser = /\.get\(["'](.+?)["']\)/g,
            match;

        //this looks for field changes
        for (match = parser.exec(fn); match; match = parser.exec(fn)) {
            if (JSoop.util.Array.indexOf(watching, match[1]) === -1) {
                watching.push(match[1]);
            }
        }

        me.watchingFields = watching;

        parser = /\.get([A-Z][a-zA-Z0-9]*)\(.*\)/g;
        watching = [];

        for (match = parser.exec(fn); match; match = parser.exec(fn)) {
            if (JSoop.util.Array.indexOf(watching, match[1]) === -1) {
                watching.push(match[1]);
            }
        }

        me.watchingAssociations = watching;
    },

    getRenderData: function () {
        var me = this;

        return me.formatter(me.model, me.owner);
    },

    onChange: function (model, newValues) {
        var me = this,
            update = false;

        JSoop.each(me.watchingFields, function (field) {
            if (newValues.hasOwnProperty(field)) {
                update = true;

                return false;
            }
        });

        if (update) {
            me.update();
        }
    },

    onAssociationChange: function (model, name) {
        var me = this;

        //this could cause an issue when watching many different associations
        if (JSoop.util.Array.indexOf(me.watchingAssociations, name) !== -1) {
            me.update();
        }
    }
});
