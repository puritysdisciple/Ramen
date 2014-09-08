/**
 * @class Ramen.view.binding.ModelBinding
 * A special binding used to monitor a {@link Ramen.data.Model} and update its content based on changes to said model.
 * @extends Ramen.view.binding.Binding
 */
JSoop.define('Ramen.view.binding.ModelBinding', {
    extend: 'Ramen.view.binding.Binding',

    isModelBinding: true,

    watchingFields: null,
    watchingAssociations: null,

    /**
     * @cfg {Function} formatter
     * A function that will be used to format any model data prior to rendering it. If {@link #field} is set, this will
     * be ignored.
     * @param {Ramen.data.Model} model The model
     * @param {Ramen.view.Box} view The view managing the binding
     * @returns {String} The formatted data
     */
    /**
     * @cfg {String} field
     * The field within the model that should be monitored for change. If this is set, then {@link #formatter} will be
     * ignored.
     */

    initBinding: function () {
        var me = this;

        if (me.field) {
            me.formatter = new Function('model', 'return model.get("' + me.field + '");');
        }

        me.parseWatchers();

        me.mon(me.model, 'change', me.onChange, me);
        me.mon(me.model, 'change:association', me.onAssociationChange, me);
    },

    /**
     * @private
     * @returns {Object}
     */
    getRenderData: function () {
        var me = this;

        return me.formatter(me.model, me.owner);
    },

    /**
     * @private
     */
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

    /**
     * @private
     * @param {Ramen.data.Model} model
     * @param {Mixed} newValues
     */
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

    /**
     * @private
     * @param {Ramen.data.Model} model
     * @param {String} name
     */
    onAssociationChange: function (model, name) {
        var me = this;

        //this could cause an issue when watching many different associations
        if (JSoop.util.Array.indexOf(me.watchingAssociations, name) !== -1) {
            me.update();
        }
    }
});
