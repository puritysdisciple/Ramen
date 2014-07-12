JSoop.define('Spine.view.binding.ModelBinding', {
    extend: 'Spine.view.binding.Binding',

    isModelBinding: true,

    initBinding: function () {
        var me = this;

        if (me.field) {
            me.formatter = new Function('model', 'return model.get("' + me.field + '");');
        }

        me.parseWatchers();

        me.mon(me.model, 'change', me.onChange, me);
    },

    parseWatchers: function () {
        var me = this,
            watching = [],
            fn = me.formatter.toString(),
            parser = /\.get\(["'](.+?)["']\)/g,
            match;

        for (match = parser.exec(fn); match; match = parser.exec(fn)) {
            if (JSoop.util.Array.indexOf(watching, match[1]) === -1) {
                watching.push(match[1]);
            }
        }

        me.watching = watching;
    },

    getRenderData: function () {
        var me = this;

        return me.formatter(me.model, me.owner);
    },

    onChange: function (model, newValues) {
        var me = this,
            update = false;

        JSoop.each(me.watching, function (field) {
            if (newValues.hasOwnProperty(field)) {
                update = true;

                return false;
            }
        });

        if (update) {
            me.update();
        }
    }
});
