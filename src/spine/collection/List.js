JSoop.define('Spine.collection.List', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable',
        pluginManager: 'JSoop.mixins.PluginManager',
        filterable: 'Spine.util.filter.Filterable',
        sortable: 'Spine.util.Sortable'
    },

    isList: true,

    constructor: function (items, config) {
        var me = this;

        me.items = [];

        me.initMixin('configurable', [config]);
        me.initMixin('observable');
        me.initMixin('pluginManager');
        me.initMixin('sortable');

        if (items) {
            me.add(items);
        }
    },

    add: function (items) {
        var me = this;

        if (me.isSorted) {
            me.addSorted(items);

            return;
        }

        me.insert(items, me.items.length);
    },

    addSorted: function (items) {
        var me = this,
            added = [];

        items = JSoop.toArray(items);

        JSoop.each(items, function (item) {
            item = me.initItem(item);

            var index = me.findInsertionIndex(item);

            if (me.fireEvent('beforeAdd', me, item, index) !== false) {
                item = me.insertItem(item, index, me.items);

                added.push(item);
            }
        });

        me.fireEvent('add', me, added);
    },

    insert: function (items, index) {
        var me = this,
            added = [];

        items = JSoop.toArray(items);

        JSoop.each(items, function (item) {
            item = me.initItem(item);

            if (me.fireEvent('beforeAdd', me, item, index) !== false) {
                item = me.insertItem(item, index, me.items);

                index = index + 1;

                added.push(item);
            }
        });

        me.fireEvent('add', me, added);
    },

    initItem: function (item) {
        return item;
    },

    insertItem: function (item, index, target) {
        target.splice(index, 0, item);

        return item;
    },

    insertUnfilteredItem: function (item, index) {
        var me = this;

        return me.insertItem(item, index, me.unfilteredItems);
    },

    remove: function (items) {
        var me = this,
            removed = [];

        items = JSoop.toArray(items);

        JSoop.each(items, function (item) {
            var index = me.indexOf(item);

            if (item !== -1 && me.fireEvent('beforeRemove', me, item, index) !== false) {
                me.removeAt(index);

                removed.push(item);
            }
        });

        me.fireEvent('remove', me, removed);
    },

    removeAt: function (index) {
        this.items.splice(index, 1);
    },

    indexOf: function (item) {
        var me = this;

        return me.items.indexOf(item);
    },

    at: function (index) {
        return this.items[index];
    },

    each: function (fn, scope) {
        var me = this,
            items = me.items.slice(),
            i = 0,
            length = items.length;

        scope = scope || me;

        for (; i < length; i = i + 1) {
            if (fn.call(scope, items[i], i) === false) {
                return;
            }
        }
    },

    getCount: function () {
        return this.items.length;
    },

    afterSort: function (list, sorted) {
        var me = this;

        me.fireEvent('sort', me, sorted);
    },

    afterFilter: function (list, filtered, unfiltered) {
        var me = this;

        me.fireEvent('filter', me, filtered, unfiltered);
    },

    onBeforeAdd: function (list, item, index) {
        var me = this;

        if (me.isFiltered) {
            if (me.isSorted) {
                index = me.findInsertionIndex(item, me.sortFn, me.unfilteredItems);
            } else {
                index = me.unfilteredItems.length;
            }

            me.insertUnfilteredItem(item, index);

            if (!me.currentFilter.is(item)) {
                return false;
            }
        }
    },
    onBeforeRemove: JSoop.emptyFn
});
