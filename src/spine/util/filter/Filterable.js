JSoop.define('Spine.util.filter.Filterable', {
    isFilterable: true,
    isFiltered: false,

    filterTarget: 'items',
    filterType: 'Spine.util.filter.Filter',

    filter: function (config) {
        var me = this,
            filter = me.createFilter(config),
            filtered = me.runFilter(filter);

        if (me.beforeFilter(me) === false) {
            return;
        }

        if (!me.isFiltered) {
            me.unfilteredItems = me[me.filterTarget].slice();
        }

        me.currentFilter = filter;
        me.isFiltered = true;

        me[me.filterTarget] = filtered;

        me.afterFilter(me, filtered, me.unfilteredItems);
    },

    createFilter: function (filter) {
        var me = this;

        if (filter.isFilter) {
            return filter;
        }

        return JSoop.create(me.filterType, filter);
    },

    runFilter: function (filter) {
        var me = this,
            filtered = [],
            items;

        if (me.isFiltered) {
            items = me.unfilteredItems.slice();
        } else {
            items = me[me.filterTarget].slice();
        }

        JSoop.each(items, function (item) {
            if (filter.is(item)) {
                filtered.push(item);
            }
        });

        return filtered;
    },

    clearFilter: function () {
        var me = this;

        if (!me.isFiltered) {
            return;
        }

        me.isFiltered = false;
        me.currentFilter = null;

        me[me.filterTarget] = me.unfilteredItems;

        delete me.unfilteredItems;
    },

    find: function (config) {
        var me = this,
            filter = me.createFilter(config);

        return me.runFilter(filter);
    },

    first: function (config) {
        var me = this,
            filter = me.createFilter(config),
            filtered = me.runFilter(filter);

        return filtered[0];
    },

    last: function (config) {
        var me = this,
            filter = me.createFilter(config),
            filtered = me.runFilter(filter);

        return filtered[filtered.length - 1];
    },

    beforeFilter: JSoop.emptyFn,
    afterFilter: JSoop.emptyFn
});
