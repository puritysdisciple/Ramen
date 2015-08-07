/**
 * @class Ramen.collection.Dictionary
 * Represents a set of key value pairs similar to a standard javascript object. However, Dictionary provides additional
 * functionality such as sorting and filtering.
 * @extends Ramen.collection.List
 */
JSoop.define('Ramen.collection.Dictionary', {
    extend: 'Ramen.collection.List',

    isDictionary: true,

    //region Ramen.collection.List Overrides
    //====================================================================================================
    constructor: function () {
        var me = this;

        me.keys = [];
        me.cache = {};

        me.callParent(arguments);
    },

    indexOf: function (item) {
        var me = this;

        if (JSoop.isPrimitive(item)) {
            return me.indexOfKey(item);
        }

        return me.callParent(arguments);
    },

    /**
     * Checks to see whether the dictionary has the specified item.
     * @param {Mixed} item The item to search for
     * @returns {Boolean}
     */
    has: function (item) {
        return !!this.cache[this.getKey(item)];
    },

    insertItem: function (item, index, target) {
        var me = this,
            key = me.getKey(item);

        if (target !== me.unfilteredItems) {
            me.keys.splice(index, 0, key);

            me.cache[key] = item;
        }

        return me.callParent(arguments);
    },

    insertUnfilteredItem: function (item, index) {
        var me = this,
            key = me.getKey(item);

        me.unfilteredKeys.splice(index, 0, key);

        return me.callParent(arguments);
    },

    removeAt: function (index) {
        var me = this,
            key = me.keys[index];

        me.keys.splice(index, 1);

        delete me.cache[key];

        me.callParent(arguments);
    },

    onAddBefore: function (dictionary, item, index) {
        var me = this;

        if (me.has(item) || me.callParent(arguments) === false) {
            return false;
        }
    },

    sort: function (fn) {
        var me = this;

        if (JSoop.isString(fn)) {
            fn = me.createSortFn(fn);
        }

        me.mixins.sortable.prototype.sort.apply(me, [fn]);

        me.ids = [];

        JSoop.each(me.items, function (item) {
            me.ids.push(me.getKey(item));
        });
    },

    afterFilter: function () {
        var me = this;

        me.unfilteredKeys = me.keys.slice();

        me.rebuildKeys();
        me.rebuildCache();

        me.callParent(arguments);
    },

    onRemoveAll: function () {
        var me = this;

        me.keys = [];
        me.unfilteredKeys = [];

        me.cache = {};
    },
    //endregion

    //region New Members
    //====================================================================================================
    /**
     * Gets the key of the specified item.
     * @param {Mixed} item
     * @returns {String}
     */
    getKey: function (item) {
        return item.id;
    },
    /**
     * Gets the index of the specified key.
     * @param {String} key
     * @returns {Number}
     */
    indexOfKey: function (key) {
        var me = this;

        return JSoop.util.Array.indexOf(me.keys, key);
    },
    /**
     * Gets the item that matches the specified key.
     * @param {String} key
     * @returns {Mixed}
     */
    get: function (key) {
        return this.cache[key];
    },
    /**
     * Iterates over the dictionary, executing the given function on each item. If the function returns false, execution
     * will stop.
     * @param {Function} fn The function to execute
     * @param {Mixed} fn.item The current item
     * @param {String} fn.key The current key
     * @param {Object} [scope] The object to scope the functiojn to, defaults to the dictionary.
     */
    iterate: function (fn, scope) {
        var me = this,
            keys = me.keys.slice();

        scope = scope || me;

        me.each(function (item, index) {
            return fn.call(scope, item, keys[index]);
        });
    },
    /**
     * @private
     * @param {Function/String} fn
     * @param {"asc"/"desc"} dir
     * @returns {Function}
     */
    createSortFn: function (fn, dir) {
        var body;

        if (JSoop.isString(fn)) {
            body = [
                'var val1 = item1["' + fn + '"]',
                '    val2 = item2["' + fn + '"];',
                'if (val1 ' + ((dir === 'desc')? '>' : '<') + ' val2) {',
                '   return -1;',
                '}',
                'if (val1 ' + ((dir === 'desc')? '<' : '>') + ' val2) {',
                '   return 1;',
                '}',
                'return 0;'
            ];

            fn = new Function('item1', 'item2', body.join('\n'));
        }

        return fn;
    },
    /**
     * @private
     */
    rebuildCache: function () {
        var me = this;

        me.cache = {};

        me.iterate(function (item, key) {
            me.cache[key] = item;
        });
    },
    /**
     * @private
     */
    rebuildKeys: function () {
        var me = this;

        me.keys = [];

        me.each(function (item) {
            me.keys.push(me.getKey(item));
        });
    }
    //endregion
});
