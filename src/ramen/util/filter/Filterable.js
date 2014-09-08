/**
 * @class Ramen.util.filter.Filterable
 * A mixin that adds filtering capability to a class.
 */
JSoop.define('Ramen.util.filter.Filterable', {
    isFilterable: true,
    isFiltered: false,

    /**
     * @cfg
     * The property that should be filtered
     */
    filterTarget: 'items',
    /**
     * @cfg
     * The type that should be used when creating a filter
     */
    filterType: 'Ramen.util.filter.Filter',

    constructor: function () {
        var me = this;

        me.filters = {};
    },
    /**
     * Adds a filter
     * @param {String} name The name of the filter
     * @param {Object} config The filter config
     */
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
    /**
     * Removes a filter
     * @param {String} name The name of the filter
     */
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
    /**
     * Executes all filters.
     */
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
    /**
     * @private
     * @param filter
     * @returns {*}
     */
    createFilter: function (filter) {
        var me = this;

        if (filter.isFilter) {
            return filter;
        }

        return JSoop.create(me.filterType, filter);
    },
    /**
     * @private
     * @param filter
     * @returns {Mixed[]}
     */
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
    /**
     * Removes all filters.
     */
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
    /**
     * Gets all items that match the given filter.
     * @param {Ramen.util.filter.Filter/Object} config The filter or filter config to use to search
     * @returns {Mixed[]} The matching items
     */
    find: function (config) {
        var me = this,
            filter = me.createFilter(config);

        return me.runFilter(filter);
    },
    /**
     * Gets the first item that passes the given filter.
     * @param {Ramen.util.filter.Filter/Object} config The filter or filter config to use to search
     * @returns {Mixed} The matching item
     */
    findFirst: function (config) {
        var me = this,
            filter = me.createFilter(config),
            filtered = me.runFilter(filter);

        return filtered[0];
    },
    /**
     * Gets the last item that passes the given filter.
     * @param {Ramen.util.filter.Filter/Object} config The filter or filter config to use to search
     * @returns {Mixed} The matching item
     */
    findLast: function (config) {
        var me = this,
            filter = me.createFilter(config),
            filtered = me.runFilter(filter);

        return filtered[filtered.length - 1];
    },
    /**
     * @method
     * @template
     * Called before executing a filter.
     */
    beforeFilter: JSoop.emptyFn,
    /**
     * @method
     * @template
     * Called after executing a filter.
     */
    afterFilter: JSoop.emptyFn
});
