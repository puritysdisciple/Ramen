//TODO: Add filtering capabilities
JSoop.define('Spine.data.Collection', {
    extend: 'Spine.collection.Dictionary',

    //====================================================================================================
    //Spine.collection.Dictionary Overrides
    //====================================================================================================
    filterType: 'Spine.data.filter.ModelFilter',

    config: {
        required: [
            'model'
        ]
    },

    getKey: function (item) {
        return item.get(item.idField);
    },

    initItem: function (item) {
        return this.create(item);
    },

    createSortFn: function (fn, dir) {
        var body;

        if (JSoop.isString(fn)) {
            body = [
                'var val1 = model1.get("' + fn + '"),',
                '    val2 = model2.get("' + fn + '");',
                'if (val1 ' + ((dir === 'desc')? '>' : '<') + ' val2) {',
                '   return -1;',
                '}',
                'if (val1 ' + ((dir === 'desc')? '<' : '>') + ' val2) {',
                '   return 1;',
                '}',
                'return 0;'
            ];

            fn = new Function('model1', 'model2', body.join('\n'));
        }

        return fn;
    },

    onBeforeAdd: function (collection, item, index) {
        var me = this;

        if (me.callParent(arguments) === false) {
            index = me.indexOfKey(me.getKey(item));

            //merge models if it is already in the collection
            if (index !== -1) {
                me.items[index].set(item.attributes);
            }

            return false;
        }
    },

    //====================================================================================================
    //New Members
    //====================================================================================================
    isCollection: true,

    create: function (item) {
        var me = this;

        if (item.isModel) {
            return item;
        }

        return JSoop.create(me.model, item);
    }
});
