JSoop.define('Spine.collection.Dictionary', {
    extend: 'Spine.collection.List',

    isDictionary: true,

    //====================================================================================================
    //Spine.collection.List Overrides
    //====================================================================================================
    constructor: function () {
        var me = this;

        me.keys = [];
        me.cache = {};

        me.callParent(arguments);
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
        var me = this;

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

    onBeforeAdd: function (dictionary, item, index) {
        var me = this,
            key = me.getKey(item);

        if (me.indexOfKey(key) !== -1 || me.callParent(arguments) === false) {
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

        me.fireEvent('sort', me);
    },

    afterFilter: function () {
        var me = this;

        me.unfilteredKeys = me.keys.slice();

        me.rebuildKeys();
        me.rebuildCache();
    },

    //====================================================================================================
    //New Members
    //====================================================================================================
    getKey: function (item) {
        return item.id;
    },

    indexOfKey: function (key) {
        var me = this;

        return me.keys.indexOf(key);
    },

    get: function (key) {
        return this.cache[key];
    },

    iterate: function (fn, scope) {
        var me = this,
            keys = me.keys.slice();

        me.each(function (item, index) {
            return fn.call(scope, item, keys[index]);
        });
    },

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

    rebuildCache: function () {
        var me = this;

        me.cache = {};

        me.iterate(function (item, key) {
            me.cache[key] = item;
        });
    },

    rebuildKeys: function () {
        var me = this;

        me.keys = [];

        me.each(function (item) {
            me.keys.push(me.getKey(item));
        });
    }
});
