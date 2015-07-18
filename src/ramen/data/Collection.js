/**
 * @class Ramen.data.Collection
 * Represents a set of {@link Ramen.data.Model}'s.
 * @extends Ramen.collection.Dictionary
 */
JSoop.define('Ramen.data.Collection', {
    extend: 'Ramen.collection.Dictionary',

    //====================================================================================================
    //Ramen.collection.Dictionary Overrides
    //====================================================================================================
    filterType: 'Ramen.data.filter.ModelFilter',

    config: {
        required: [
            /**
             * @cfg {String} model
             * The default model type this collection manages. This is used when a raw javascript object is added to the
             * collection.
             */
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

    onAddBefore: function (collection, item, index) {
        var me = this;

        if (me.callParent(arguments) === false) {
            index = me.indexOfKey(me.getKey(item));

            //merge models if it is already in the collection
            if (index !== -1) {
                me.items[index].set(item.mergeData);

                delete item.mergeData;
            }

            return false;
        } else {
            delete item.mergeData;
        }
    },

    //====================================================================================================
    //New Members
    //====================================================================================================
    isCollection: true,

    /**
     * Makes sure that the given item is a {@link Ramen.data.Model}.
     * @param {Ramen.data.Model/Object} item
     * @returns {Ramen.data.Model}
     */
    create: function (item) {
        var me = this;

        if (item.isModel) {
            return item;
        }

        return JSoop.create(me.model, item, {
            mergeData: item
        });
    },

    clone: function () {
        var me = this,
            newCollection = JSoop.create('Ramen.data.Collection', me.items.slice(), {
                model: me.model
            });

        newCollection.mon(me, {
            add: function (collection, added) {
                newCollection.add(added);
            },
            remove: function (collection, removed) {
                newCollection.remove(removed);
            }
        });

        return newCollection;
    }
}, function () {
    Ramen.collections = {};

    /**
     * @member Ramen
     * @param {String} name
     * @param {Ramen.data.Collection} collection
     */
    Ramen.addCollection = function (name, collection) {
        Ramen.collections[name] = collection;
    };

    /**
     * @member Ramen
     * @param {String} name
     * @returns {Ramen.data.Collection}
     */
    Ramen.getCollection = function (name) {
        return Ramen.collections[name];
    };
});
