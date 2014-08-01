JSoop.define('Spine.util.filter.Filterable', {
    isFilterable: true,
    isFiltered: false,

    filterTarget: 'items',
    filterType: 'Spine.util.filter.Filter',

    constructor: function () {
        var me = this;

        me.filters = {};
    },

    addFilter: function (name, config) {
        var me = this,
            filters = name;

        if (JSoop.isString(filters)) {
            filters = {};
            filters[name] = config;
        }

        JSoop.iterate(filters, function (config, name) {
            var filter = me.createFilter(config);

            me.filters[name] = filter;
        });

        me.filter();
    },

    removeFilter: function (name) {
        var me = this;

        delete me.filters[name];

        me.filter();
    },

    createFilterFn: function () {
        var me = this,
            body = ['true'],
            fn;

        JSoop.iterate(me.filters, function (filter, name) {
            body.push('this.filters["' + name + '"].is(item)');
        });

        body = 'return ' + body.join('&&') + ';';

        fn = new Function('item', body);

        return function () {
            return fn.apply(me, arguments);
        };
    },

    filter: function () {
        var me = this,
            filtered;

        if (me.beforeFilter(me) === false) {
            return;
        }

        if (!me.isFiltered) {
            me.unfilteredItems = me[me.filterTarget].slice();
        }

        me.currentFilter = me.createFilter({
            fn: me.createFilterFn()
        });

        filtered = me.runFilter(me.currentFilter);

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

    clearFilters: function () {
        var me = this;

        if (!me.isFiltered) {
            return;
        }

        me.isFiltered = false;
        me.currentFilter = null;
        me.filters = {};

        me[me.filterTarget] = me.unfilteredItems;

        delete me.unfilteredItems;

        me.afterFilter(me, me[me.filterTarget], me[me.filterTarget]);
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
