/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * @class Ramen
 * The Ramen namespace encompasses all classes, singletons, and utility methods provided by the framework. Most
 * functionality is nested in other namespaces.
 * @singleton
 */
JSoop.define('Ramen', {
    singleton: true,

    /**
     * @method
     * Generates a unique ID.
     * @param {string} prefix The prefix to add to the ID
     * @return {string} The unique ID
     */
    id: (function () {
        var AUTO_ID = 0;

        return function (prefix) {
            AUTO_ID = AUTO_ID + 1;

            return prefix + '-' + AUTO_ID;
        };
    }())
}, function () {
    if (!JSoop.GLOBAL.Spine) {
        //This is here to support backwards compatability
        JSoop.GLOBAL.Spine = Ramen;
    }
});

/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * @class Ramen.util.Sortable
 * A mixin that adds sorting capability to a class.
 */
JSoop.define('Ramen.util.Sortable', {
    isSortable: true,
    /**
     * @cfg
     * The property that should be sorted
     */
    sortTarget: 'items',
    isSorted: false,

    /**
     * @private
     * @param {Mixed} newItem
     * @param {Function} [fn]
     * @param {Mixed[]} [target]
     * @returns {Number}
     */
    findInsertionIndex: function(newItem, fn, target) {
        var me = this,
            items = target || me[me.sortTarget],
            start = 0,
            end = items.length - 1,
            middle, comparison;

        fn = fn || me.sortFn;

        while (start <= end) {
            middle = (start + end) >> 1;
            comparison = fn(newItem, items[middle]);

            if (comparison >= 0) {
                start = middle + 1;
            } else if (comparison < 0) {
                end = middle - 1;
            }
        }

        return start;
    },
    /**
     * Sorts the target based on the given comparator.
     * @param {Function} fn The comparator to sort the target by
     */
    sort: function (fn) {
        var me = this;

        me[me.sortTarget].sort(fn);

        me.isSorted = true;
        me.sortFn = fn;

        me.afterSort(me, me[me.sortTarget]);
    },
    /**
     * Removes the current sort. This does not change the order of any items.
     */
    clearSort: function () {
        var me = this;

        me.isSorted = false;

        delete me.sortFn;
    },
    /**
     * @method
     * @template
     * Executed after a sort has taken place
     * @param {Ramen.util.Sortable} me The class that did the sort
     * @param {Mixed[]} sortedItems The target of the sort
     */
    afterSort: JSoop.emptyFn
});

/**
 * @class Ramen.util.filter.Filter
 * Represents a set of conditions used to filter items.
 * @mixins JSoop.mixins.Configurable
 */
JSoop.define('Ramen.util.filter.Filter', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    /**
     * @param {Object/Function} attributes The attributes to be used in the filter, or a filter function
     * @param {Object} [config] The config object
     */
    constructor: function (attributes, config) {
        var me = this;

        if (arguments.length === 1) {
            if (attributes.fn) {
                config = attributes;
            } else if (JSoop.isFunction(attributes)) {
                config = {
                    fn: attributes
                };
            } else {
                config = {
                    fn: me.createFilterFn(attributes),
                    attributes: attributes
                };
            }
        } else {
            config.attributes = attributes;
        }

        me.initMixin('configurable', [config]);
    },

    /**
     * Creates a filter function based on the given attributes.
     * @param {Object} attributes The attributes to compare
     * @returns {Function}
     */
    createFilterFn: function (attributes) {
        var body = [];

        JSoop.iterate(attributes, function (value, key) {
            body.push('item["' + key + '"] === attributes["' + key + '"]');
        });

        body = 'return ' + body.join(' && ') + ';';

        return new Function('item', 'attributes', body);
    },

    /**
     * Checks whether or not the given item matches the filter.
     * @param {Mixed} item The item to test
     * @returns {Boolean}
     */
    is: function (item) {
        var me = this;

        return !!me.fn(item, me.attributes);
    }
});

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

/**
 * @class Ramen.collection.List
 * Represents a list of items. A list is similar to an array, but can also take advantage of many features contained in
 * its mixins. These features include events, plugins and filters. If your data needs support for keys as well as
 * indexing, you should use {@link Ramen.collection.Dictionary} instead.
 * @mixins JSoop.mixins.Configurable
 * @mixins JSoop.mixins.Observable
 * @mixins JSoop.mixins.PluginManager
 * @mixins Ramen.util.filter.Filterable
 * @mixins Ramen.util.Sortable
 */
JSoop.define('Ramen.collection.List', {
    mixins: {
        configurable : 'JSoop.mixins.Configurable',
        observable   : 'JSoop.mixins.Observable',
        pluginManager: 'JSoop.mixins.PluginManager',
        filterable   : 'Ramen.util.filter.Filterable',
        sortable     : 'Ramen.util.Sortable'
    },

    isList: true,

    /**
     * @event add
     * Triggered after items have been added to the list.
     * @param {Ramen.collection.List} list The list that fired the event
     * @param {Mixed[]} added The items that were added
     */
    /**
     * @event addBefore
     * Triggered before an item is added to the list.
     * @param {Ramen.collection.List} list The list that fired the event
     * @param {Mixed} item The item to be added
     * @preventable
     */
    /**
     * @event remove
     * Triggered after items have been removed from the list
     * @param {Ramen.collection.List} list The list that fired the event
     * @param {Mixed[]} removed The items that were removed
     */
    /**
     * @event removeBefore
     * Triggered before an item is removed from the list.
     * @param {Ramen.collection.List} list The list that fired the event
     * @param {Mixed} item The item to be removed
     * @preventable
     */
    /**
     * @event removeAll
     * Triggered when {@link #method-removeAll} is called.
     * @param {Ramen.collection.List} list The list that fired the event
     */
    /**
     * @event removeAllBefore
     * Triggered before {@link #method-removeAll} is called.
     * @param {Ramen.collection.List} list The list that fired the event
     * @preventable
     */
    /**
     * @event destroy
     * Triggered when the list is destroyed.
     * @param {Ramen.collection.List} list The list that fired the event
     */
    /**
     * @event destroyBefore
     * Triggered before the list is destroyed.
     * @param {Ramen.collection.List} list THe list that fired the event
     * @preventable
     */

    /**
     * Creates a new list.
     * @param {Mixed[]} items The initial set of items this list will manage.
     * @param {Object} config The config object.
     * @returns {Ramen.collection.List}
     */
    constructor: function (items, config) {
        var me = this;

        me.items = [];

        me.initMixin('configurable', [config]);
        me.initMixin('observable');
        me.initMixin('pluginManager');
        me.initMixin('filterable');
        me.initMixin('sortable');

        if (items) {
            me.add(items);
        }
    },
    /**
     * Adds the specified items to the list.
     * @param {Mixed[]} items The items to be added.
     */
    add: function (items) {
        var me = this;

        if (me.isSorted) {
            me.addSorted(items);

            return;
        }

        me.insert(items, me.items.length);
    },
    /**
     * @private
     * @param {Mixed[]} items
     */
    addSorted: function (items) {
        var me = this,
            added = [];

        items = JSoop.toArray(items);

        JSoop.each(items, function (item) {
            item = me.initItem(item);

            var index = me.findInsertionIndex(item);

            if (me.fireEvent('add:before', me, item, index) !== false) {
                item = me.insertItem(item, index, me.items);

                added.push(item);
            }
        });

        me.fireEvent('add', me, added);
    },
    /**
     * Inserts the specified items at the given index in the list. In general, you should use {@link #method-add}
     * instead as it will automatically handle the index when the list is sorted, this method will not.
     * @param {Mixed[]} items The items to be inserted
     * @param {Number} index The index to insert at
     */
    insert: function (items, index) {
        var me = this,
            added = [];

        items = JSoop.toArray(items);

        JSoop.each(items, function (item) {
            item = me.initItem(item);

            if (me.fireEvent('add:before', me, item, index) !== false) {
                item = me.insertItem(item, index, me.items);

                index = index + 1;

                added.push(item);
            }
        });

        me.fireEvent('add', me, added);
    },
    /**
     * Initializes an item before it is added to the list.
     * @param {Mixed} item The item to be initialized
     * @returns {Mixed} The initialized item
     */
    initItem: function (item) {
        return item;
    },
    /**
     * @private
     * @param {Mixed} item
     * @param Number index
     * @param {Mixed[]} target
     * @returns {Mixed}
     */
    insertItem: function (item, index, target) {
        target.splice(index, 0, item);

        return item;
    },
    /**
     * @private
     * @param {Mixed} item
     * @param {Number} index
     * @returns {Mixed}
     */
    insertUnfilteredItem: function (item, index) {
        var me = this;

        return me.insertItem(item, index, me.unfilteredItems);
    },
    /**
     * Removes the specified items from the list.
     * @param {Mixed} items The items to be removed
     */
    remove: function (items) {
        var me = this,
            removed = [];

        items = JSoop.toArray(items);

        JSoop.each(items, function (item) {
            var index = me.indexOf(item);

            item = me.at(index);

            if (index !== -1 && me.fireEvent('remove:before', me, item, index) !== false) {
                me.removeAt(index);

                removed.push(item);
            }
        });

        me.fireEvent('remove', me, removed);
    },
    /**
     * Removes the item at the specified index.
     * @param {Number} index The index of the item to remove
     */
    removeAt: function (index) {
        this.items.splice(index, 1);
    },
    /**
     * Removes all items from the list.
     */
    removeAll: function () {
        var me = this,
            removed;

        if (me.fireEvent('remove:all:before', me) === false) {
            return;
        }

        if (me.isFiltered) {
            removed = me.unfilteredItems;
        } else {
            removed = me.items;
        }

        me.items = [];
        me.unfilteredItems = [];

        me.fireEvent('remove:all', me);
        me.fireEvent('remove', me, removed);
    },
    /**
     * Gets the index of the specified item. If the item is not in the list, -1 will be returned.
     * @param {Mixed} item The item to search for
     * @returns {Number} The index of the item
     */
    indexOf: function (item) {
        var me = this;

        return JSoop.util.Array.indexOf(me.items, item);
    },
    /**
     * Gets the item at the specified index.
     * @param {Number} index The index of the item to get
     * @returns {Mixed} The requested item
     */
    at: function (index) {
        return this.items[index];
    },
    /**
     * Executes the specified function on each item of the list. If the function returns false, then the execution will
     * stop.
     * @param {Function} fn The function to execute
     * @param {Mixed} fn.item The current item
     * @param {Number} fn.index The current index
     * @param {Object} [scope] An object to scope the function to, defaults to the list
     */
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
    /**
     * Locates all items in the list that match the specified filter.
     * @param {Ramen.util.filter.Filter/Object} attributes The attributes or filter to search for
     * @returns {Mixed[]} The items that match the desired filter
     */
    find: function (attributes) {
        var me = this,
            filter = me.createFilter(attributes),
            found = [];

        me.each(function (item) {
            if (filter.is(item)) {
                found.push(item);
            }
        });

        return found;
    },
    /**
     * Locates the first item in the list that match the specified filter.
     * @param {Ramen.util.filter.Filter/Object} attributes The attributes or filter to search for
     * @returns {Mixed} The first item that matches the desired filter
     */
    findFirst: function (attributes) {
        var me = this,
            filter = me.createFilter(attributes),
            found;

        me.each(function (item) {
            if (filter.is(item)) {
                found = item;

                return false;
            }
        });

        return found;
    },
    /**
     * Locates the last item in the list that match the specified filter.
     * @param {Ramen.util.filter.Filter/Object} attributes The attributes or filter to search for
     * @returns {Mixed} The last item that matches the desired filter
     */
    findLast: function (attributes) {
        var me = this,
            found = me.find(attributes);

        if (found.length > 0) {
            return found.pop();
        }

        return undefined;
    },
    /**
     * Gets the total number of items in the list.
     * @returns {Number}
     */
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
    /**
     * Destroys the list.
     */
    destroy: function () {
        var me = this;

        if (me.fireEvent('destroy:before') === false) {
            return false;
        }

        me.fireEvent('destroy', me);

        me.removeAllListeners();
        me.removeAllManagedListeners();
        me.destroyAllPlugins();
        me.removeAll();
    },

    /**
     * @private
     * @param {Ramen.collection.List} list
     * @param {Mixed} item
     * @param {Number} index
     */
    onAddBefore: function (list, item, index) {
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
    onRemoveBefore: JSoop.emptyFn,
    onRemoveAll: JSoop.emptyFn,
    onDestroy: JSoop.emptyFn
});

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
     * Checks to see whether the dictionary has the specified item.
     * @param {Mixed} item The item to search for
     * @returns {Boolean}
     */
    has: function (item) {
        return this.indexOf(item) !== -1;
    },
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

/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * @class Ramen.data.association.Association
 * @mixins JSoop.mixins.Configurable
 */
JSoop.define('Ramen.data.association.Association', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    config: {
        required: [
            /**
             * @cfg {String} name (required)
             * The name of this association. This will be used to create getters on the parent model.
             */
            'name',
            /**
             * @cfg {String} model (required)
             * The type of model this association will create
             */
            'model',
            /**
             * @cfg {String} mapping (required)
             * The location of the associated data.
             */
            'mapping',
            /**
             * @cfg {String} foreignKey
             * The name of the field that contains the foreign key.
             */
        ]
    },

    /**
     * @cfg {Function/String} prepare
     * A function, or name of a function, that will be used to prepare the data prior to association. If a function name
     * is given, the function will be pulled from the parent model.
     */

    isAssociation: true,

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
    },

    parse: function (model, attributes) {
        var me = this,
            prep, data, models;

        if (me.prepare) {
            prep = me.prepare;

            if (JSoop.isString(prep)) {
                prep = model[prep];
            }

            prep.call(model, attributes);
        }

        data = me.getData(attributes);
        models = me.createModels(model, data);

        me.assignModels(model, models);
    },

    getData: function (attributes) {
        var me = this;

        return JSoop.objectQuery(me.mapping, attributes);
    },

    createModel: function (data) {
        var me = this;

        if (data.isModel) {
            return data;
        }

        return JSoop.create(me.model, data);
    },

    createAssociationChangeListener: function (model) {
        var me = this;

        return function () {
            model.fireEvent('change:association', model, me.name, model['get' + me.name]());
        };
    },

    createModels: JSoop.emptyFn,
    assignModels: JSoop.emptyFn
});

/**
 * @class Ramen.data.association.HasMany
 * @extends Ramen.data.association.Association
 */
JSoop.define('Ramen.data.association.HasMany', {
    extend: 'Ramen.data.association.Association',

    getData: function () {
        var me = this,
            data = me.callParent(arguments);

        if (!data) {
            data = [];
        }

        return JSoop.toArray(data);
    },

    createModels: function (model, data) {
        var me = this,
            models = [];

        JSoop.each(data, function (item) {
            item[me.foreignKey] = model.get(model.idField);

            var newModel = me.createModel(item);

            newModel['get' + model.name] = function () {
                return model;
            };

            models.push(newModel);
        });

        return models;
    },

    assignModels: function (model, models) {
        var me = this,
            collectionGetter = 'get' + me.name,
            collection, changeListener;

        if (!model[collectionGetter]) {
            collection = JSoop.create(me.collectionType || 'Ramen.data.Collection', [], {
                model: me.model
            });

            model[collectionGetter] = function () {
                return collection;
            };

            changeListener = me.createAssociationChangeListener(model);

            model.mon(collection, {
                add: changeListener,
                remove: changeListener,
                filter: changeListener,
                sort: changeListener,
                scope: model
            });
        } else {
            collection = model[collectionGetter]();
        }

        collection.add(models);

        if (me.globalCollection) {
            Ramen.getCollection(me.globalCollection).add(models);
        }
    }
});

/**
 * @class Ramen.data.association.HasOne
 * @extends Ramen.data.association.Association
 */
JSoop.define('Ramen.data.association.HasOne', {
    extend: 'Ramen.data.association.Association',

    createModels: function (model, data) {
        var me = this,
            newModel;

        if (!data) {
            if (model['get' + me.name]) {
                data = model['get' + me.name]().attributes;
            } else {
                data = {};
            }
        }

        data[me.foreignKey] = model.get('id');

        newModel = me.createModel(data);

        return newModel;
    },

    assignModels: function (model, models) {
        var me = this,
            getter = 'get' + me.name,
            old;

        if (model[getter]) {
            old = model['get' + me.name]();
        }

        model[getter] = function () {
            return models;
        };

        if (old) {
            model.moff(old, 'change');
        }

        model.mon(models, 'change', me.createAssociationChangeListener(model), model);
    }
});

/**
 * @class Ramen.data.filter.ModelFilter
 * @extends Ramen.util.filter.Filter
 */
JSoop.define('Ramen.data.filter.ModelFilter', {
    extend: 'Ramen.util.filter.Filter',

    createFilterFn: function (attributes) {
        var body = [];

        JSoop.iterate(attributes, function (value, key) {
            body.push('item.get("' + key + '") === attributes["' + key + '"]');
        });

        body = 'return ' + body.join(' && ') + ';';

        return new Function('item', 'attributes', body);
    }
});

/**
 * @class Ramen.data.Field
 * @private
 * @mixins JSoop.mixins.Configurable
 * The Field class is used to parse a value out of data object. It can locate the value, convert its type, and run an
 * arbitrary conversion function to make sure the resulting value is the one that is requested.
 */
JSoop.define('Ramen.data.Field', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    config: {
        required: [
            'name'
        ],
        defaults: {
            type: 'auto'
        }
    },

    statics: {
        types: {
            'bool': function (value) {
                return !!value;
            },
            'int': function (value) {
                return parseInt(value, 10);
            },
            'float': function (value) {
                return parseFloat(value);
            },
            'auto': function (value) {
                return value;
            }
        }
    },

    isField: true,

    /**
     * @cfg {String} name (required)
     * The name of the field. This is used by {@link Ramen.data.Model} when parsing its data.
     */
    /**
     * @cfg {String} [type="auto"]
     * The type the value needs to be converted to.
     */
    /**
     * @cfg {Function} [convert]
     * An arbitrary function that will be called last. Its return value will be the value the field returns.
     */

    constructor: function (config) {
        var me = this;

        if (!JSoop.isObject(config)) {
            config = {name: config};
        }

        me.initMixin('configurable', [config]);

        if (!me.mapping) {
            me.mapping = me.name;
        }
    },

    read: function (data, model) {
        var me = this,
            value = JSoop.objectQuery(me.mapping, data);

        if (value === undefined && data) {
            value = data[me.name];
        }

        return me.parse(value, data, model);
    },

    /**
     * @method parse
     * Parses a value out of the given data object.
     * @param {Object} data
     * The data object the field is parsing.
     * @param {Ramen.data.Model} [model]
     * The model the field is parsing data for.
     * @returns The parsed data value.
     */
    parse: function (value, data, model) {
        var me = this;

        if (value === undefined) {
            value = me.defaultValue;
        }

        value = Ramen.data.Field.types[me.type](value);

        if (me.convert) {
            value = me.convert(value, model, data);
        }

        return value;
    }
});

/**
 * @class Ramen.data.Model
 * @mixins JSoop.mixins.Configurable
 * @mixins JSoop.mixins.Observable
 * A model represents a single set of data.
 */
JSoop.define('Ramen.data.Model', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable'
    },

    config: {
        required: [
            /**
             * @cfg {Ramen.data.Field[]/Object[]} fields (required)
             * An array of field definitions that will be used to parse the data in this model.
             */
            'fields',
            'name'
        ]
    },

    isModel: true,

    /**
     * @cfg {String} [idField="id"]
     * The field that contains a unique id that can be used to identify each model.
     */
    idField: 'id',

    /**
     * @cfg {Ramen.data.association.Association[]/Object[]} associations
     * An array of association definitions that will be used to parse related data for this model.
     */

    onExtended: function (data, hooks) {
        var onBeforeCreated = hooks.onBeforeCreated;

        hooks.onBeforeCreated = function (data, hooks) {
            var me = this,
                statics = (JSoop.objectQuery('Ramen.data.Model'))? Ramen.data.Model : data.statics;

            onBeforeCreated.call(me, data, hooks);

            statics.initFields.call(me);
            statics.initAssociations.call(me);
        };
    },

    statics: {
        /**
         * @private
         */
        initFields: function () {
            var me = this,
                prototype = (me.prototype)? me.prototype : me.$class.prototype,
                superPrototype = prototype.superClass.prototype,
                protoFields = (prototype.hasOwnProperty('fields'))? prototype.fields : [],
                superFields = superPrototype.fields,
                fields = (superFields)? superFields.slice() : [],
                fieldCache = prototype.fieldCache = {};

            fields = fields.concat(protoFields);

            JSoop.each(fields, function (field, index) {
                if (!field.isField) {
                    field = JSoop.create('Ramen.data.Field', field);
                }

                fieldCache[field.name] = field;
                fields[index] = field;
            });

            prototype.fields = fields;
        },
        /**
         * @private
         */
        initAssociations: function () {
            var me = this,
                prototype = (me.prototype)? me.prototype : me.$class.prototype,
                superPrototype = prototype.superClass.prototype,
                protoAssociations = (prototype.hasOwnProperty('associations'))? prototype.associations : [],
                superAssociations = superPrototype.associations,
                associations = (superAssociations)? superAssociations.slice() : [];

            associations = associations.concat(protoAssociations);

            JSoop.each(associations, function (association, index) {
                var type;

                if (!association.isAssociation) {
                    switch (association.type) {
                        case 'hasMany':
                            type = 'HasMany';
                            break;
                        case 'hasOne':
                            type = 'HasOne';
                            break;
                    }

                    association = JSoop.create('Ramen.data.association.' + type, association);
                }

                associations[index] = association;
            });

            prototype.associations = associations;
        },
        /**
         * @private
         */
        addFields: function (fields) {
            var me = this;

            //calling addFields makes the fields reference local to this model
            me.fields = me.fields.slice();
            me.fieldCache = JSoop.clone(me.fieldCache);

            JSoop.each(fields, function (field) {
                if (!field.isField) {
                    field = JSoop.create('Ramen.data.Field', field);
                }

                me.fields.push(field);
                me.fieldCache[field.name] = field;
            });
        }
    },

    /**
     * @param {Object} [data] The model's initial data.
     * @param {Object} [config] Config options to be applied to the model.
     */
    constructor: function (data, config) {
        var me = this,
            fields;

        if (config) {
            fields = config.fields;

            delete config.fields;
        }

        me.initMixin('configurable', [config]);
        me.initMixin('observable');

        me.attributes = {};

        if (fields) {
            Ramen.data.Model.addFields.call(me, fields);
        }

        if (data) {
            me.set(data);
        }
    },

    /**
     * Retrieves the current value of the specified field.
     * @param {String} field
     * @returns {Mixed} The current value of the field.
     */
    get: function (field) {
        return this.attributes[field];
    },

    /**
     * Retrieves the value idField.
     * @returns {Mixed} The current value of the idField.
     */
    getId: function () {
        var me = this;

        return me.get(me.idField);
    },

    /**
     * Sets the value of one or more fields. The values will be parsed before being set.
     * @param {String/Object} field
     * @param {Mixed} [value]
     */
    set: function (field, value) {
        var me = this,
            data = {},
            attributes = field,
            newValues = {},
            oldValues = {};

        if (!JSoop.isObject(attributes)) {
            attributes = {};
            attributes[field] = value;
        }

        if (me.getId() === undefined && attributes[me.idField] === undefined) {
            //this will trigger the id field parsing if no id exists
            attributes[me.idField] = '';
        }

        attributes = JSoop.apply(JSoop.clone(me.attributes), attributes);

        JSoop.each(me.fields, function (field) {
            var ret = field.read(attributes, me);

            if (ret !== undefined) {
                data[field.name] = ret;
            }
        });

        JSoop.iterate(data, function (value, field) {
            var oldValue = me.get(field);

            me.attributes[field] = value;

            me.fireEvent('change:' + field, me, value, oldValue);

            if (oldValue !== value) {
                oldValues[field] = oldValue;
                newValues[field] = value;
            }
        });

        me.parseAssociations(attributes);

        /**
         * @event change
         * Fired when data changes within the model.
         * @param {Ramen.data.Model} model The model that fired the event
         * @param {Object} oldValues The old values
         * @param {Object} newValues The new values
         */
        me.fireEvent('change', me, oldValues, newValues);
    },

    /**
     * @event changeAssociation
     * Fired when one of the data within one of the model's associations changes.
     * @param {Ramen.data.Model} model The model that fired the event
     * @param {String} name The name of the association that changed
     * @param {Mixed} data The data of the association
     */

    /**
     * @private
     */
    parseAssociations: function (attributes) {
        var me = this,
            associations = me.associations;

        if (!associations) {
            return;
        }

        JSoop.each(associations, function (association) {
            association.parse(me, attributes);
        });
    }
});

/**
 * @class Ramen.data.Query
 * @private
 */
JSoop.define('Ramen.data.Query', {
    constructor: function (field, value) {
        var me = this,
            data = field;

        if (!JSoop.isObject(data)) {
            data = {};
            data[field] = value;
        }

        me.data = data;

        me.createFn();
    },

    createFn: function () {
        var me = this,
            fn = [];

        JSoop.iterate(me.data, function (value, field) {
            fn.push('model.get("' + field + '") === data["' + field + '"]');
        });

        me.fn = new Function('model', 'data', 'return ' + fn.join('&&') + ';');
    },

    is: function (model) {
        var me = this;

        return me.fn(model, me.data);
    }
});

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

/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * @class Ramen.app.Application
 * Represents a Ramen application. In most cases, this is a single page application that contains one or more
 * {@link Ramen.view.View views}. The behavior of views is controlled by {@link Ramen.app.Controller controllers} and
 * application data is managed through {@link Ramen.data.Model models} and {@link Ramen.data.Collection collections}.
 *
 * Controllers and collections are instantiated through this class:
 *
 *      Ramen.application({
 *          collections: {
 *              Users: 'Demo.collection.Users'
 *          },
 *
 *          controllers: {
 *              user: 'Demo.collection.User'
 *          },
 *
 *          run: function () {
 *              //application execution
 *          }
 *      });
 *
 * This will setup the desired collection and controller, and will call the `run` function when everything is ready. It
 * should rarely be required to extend this class. Instead, use {@link Ramen#application} to create a new application.
 *
 * @mixins JSoop.mixins.Configurable
 */
JSoop.define('Ramen.app.Application', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    /**
     * @cfg {Object} controllers
     * Creates controllers with the given names and types. In the following example, the controller `user` will be
     * created with the type `Demo.controller.User`:
     *
     *      ...
     *      controllers: {
     *          user: 'Demo.controller.User'
     *      },
     *      ...
     *
     * The value of each key-value pair can either be a `string` defining the type that should be created, or a config
     * object that can be used to create a controller. If a config object is used, the `type` key must be populated
     * with the desired controller type to be created. Each controller receives an `app` property that references the
     * application that created it.
     */
    /**
     * @cfg {Object} collections
     * Creates collections with the given names and types. These collections will then be accessible via
     * {@link Ramen#getCollection}. For example, the following creates a collection of type `Demo.collection.Users` and
     * makes it available under the name `Users`.
     *
     *      ...
     *      collections: {
     *          Users: 'Demo.collection.Users'
     *      },
     *      ...
     */

    /**
     * Creates a new Application
     * @param {Object} config The config object
     */
    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);

        me.initCollections();
        me.initControllers();

        me.run();

        Ramen.app.History.start();
    },

    initCollections: function () {
        var me = this;

        me.collections = me.collections || {};

        JSoop.iterate(me.collections, function (value, key) {
            if (!value.isCollection) {
                value = JSoop.create(value);
            }

            Ramen.addCollection(key, value);
        });
    },

    initControllers: function () {
        var me = this;

        me.controllers = me.controllers || {};

        JSoop.iterate(me.controllers, function (value, key) {
            if (JSoop.isString(value)) {
                value = {
                    type: value
                };
            }

            value.app = me;

            me.controllers[key] = JSoop.create(value.type, value);
        });
    },

    /**
     * @method
     * Called after all {@link #controllers} and {@link #collections} have been created.
     * @template
     */
    run: JSoop.emptyFn
}, function () {
    /**
     * @member Ramen
     * Creates a new {@link Ramen.app.Application}.
     * @param {Object} config The config object
     */
    Ramen.application = function (config) {
        if (config.requires) {
            JSoop.Loader.require(config.requires);
        }

        JSoop.create('Ramen.app.Application', config);
    };
});

/**
 * @class Ramen.app.Controller
 * @mixins JSoop.mixins.Configurable
 * Represents a set of behaviors. In general this means responding to changes in page state or using
 * {@link Ramen.view.View view} events to change that state. Controllers do this through
 * {@link Ramen.app.Controller#routes routes} and {@link Ramen.app.Controller#control controlls}. For example, a
 * controller designed to handle user state could look something like:
 *
 *      JSoop.define('Demo.controller.User', {
 *          extend: 'Ramen.app.Controller',
 *
 *          routes: {
 *              'users/list': 'onRouteList',
 *              'users/edit/:user': 'onRouteEdit'
 *          },
 *
 *          initController: function () {
 *              var me = this;
 *
 *              me.control({
 *                  'user-list': {
 *                      'select': me.onUserSelect,
 *                      'scope': me
 *                  }
 *              });
 *
 *              me.callParent(arguments);
 *          },
 *
 *          onRouteEdit: function (user) {
 *              user = Ramen.getCollection('Users').get(parseInt(user, 10));
 *              ...
 *          },
 *
 *          onUserSelect: function (user) {
 *              this.navigate('users/edit/' + user.get('id'));
 *          }
 *      });
 *
 * If a controller starts becoming too large, it is advisable to break it into smaller pieces using
 * {@link Ramen.app.Helper helpers}. This can make very large sections of your app's behavior easier to manage, without
 * breaking the desired structure.
 */
JSoop.define('Ramen.app.Controller', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    /**
     * @cfg {Object} routes
     * A list of routes and callbacks. If the browser's hash matches one of the patterns here, it will trigger the
     * defined callback. The callback can be either a function or name of a function. Also, the scope of a callback
     * can be defined with either an object, or the name of a helper. For example:
     *
     *      ...
     *      helpers: {
     *          'search': 'Demo.controller.helpers.UserSearch'
     *      },
     *
     *      routes: {
     *          'users/edit/:user': 'onRouteEdit',
     *          'users/search?:query': {
     *              fn: 'onRouteSearch',
     *              //use the search helper
     *              scope: 'search'
     *          }
     *      },
     *
     *      onRouteEdit: function (user) {
     *          ...
     *      },
     *      ...
     */

    /**
     * @cfg {Object} helpers
     * A list of helpers that will be created. For example:
     *
     *      ...
     *      helpers: {
     *          search: 'Demo.controller.helpers.UserSearch'
     *      },
     *      ...
     *
     * See {@link Ramen.app.Helper} for more details about helpers.
     */

    /**
     * Creates a new controller
     * @param {Object} config The config object
     */
    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);

        me.queries = {};

        me.controlling = [];

        Ramen.view.ViewManager.on('add', me.onViewAdd, me);

        me.initController();
        me.initHelpers();
        me.initRouter();
    },

    /**
     * @method
     * Called after the config has been applied, but before any other actions have been taken.
     * @template
     */
    initController: JSoop.emptyFn,

    initHelpers: function () {
        var me = this,
            helpers = me.helpers;

        me.helpers = {};

        if (helpers) {
            JSoop.iterate(helpers, function (helper, key) {
                if (JSoop.isString(helper)) {
                    helper = {
                        type: helper
                    };
                }

                helper.owner = me;

                me.helpers[key] = JSoop.create(helper.type, helper);
            });
        }
    },

    initRouter: function () {
        var me = this;

        me.routes = me.routes || {};

        me.router = JSoop.create('Ramen.app.Router', {
            listeners: {
                route: me.onRouterRoute,
                scope: me
            }
        });

        JSoop.iterate(me.routes, function (callback, route) {
            me.router.add(route);
        });
    },

    /**
     * Gets a reference to the Ramen.app.Application that created the controller.
     * @returns {Ramen.app.Application}
     */
    getApp: function () {
        return this.app;
    },

    /**
     * Sets up {@link Ramen.view.Query view queries} that can be used to identify new views added to
     * {@link Ramen.view.ViewManager}. If a view matches one of the selectors, the events nested in the object will be
     * attached to it. For example, this will attach to all new views and log a message when they are rendered:
     *
     *      this.control({
     *          //look for all new views
     *          'view': {
     *              'render:after': function (view) {
     *                  console.log(view.getId() + ' rendered');
     *              }
     *          }
     *      });
     *
     * @param {Object} config The list of selectors and events this controller should react to
     */
    control: function (config) {
        var me = this;

        JSoop.iterate(config, function (events, selector) {
            me.controlling.push({
                selector: selector,
                events: events,
                query: Ramen.view.Query.parse(selector)
            });
        });
    },

    /**
     * @inheritdoc Ramen.app.History#navigate
     */
    navigate: function (config) {
        Ramen.app.History.navigate(config);
    },

    onViewAdd: function (manager, views) {
        var me = this;

        JSoop.each(me.controlling, function (control) {
            JSoop.each(views, function (view) {
                if (control.query.is(view)) {
                    view.on(control.events);
                }
            });
        });
    },

    onRouterRoute: function (router, path, route) {
        var me = this,
            callback = me.routes[path];

        if (!callback) {
            return;
        }

        if (JSoop.isString(callback)) {
            callback = {
                fn: callback
            };
        }

        JSoop.applyIf(callback, {
            scope: me
        });

        if (JSoop.isString(callback.scope)) {
            callback.scope = me.helpers[callback.scope];
        }

        if (JSoop.isString(callback.fn)) {
            callback.fn = callback.scope[callback.fn];
        }

        return callback.fn.apply(callback.scope, route.getParams(Ramen.app.History.getFragment()));
    }
});

/**
 * @class Ramen.app.Helper
 * @mixins JSoop.mixins.Configurable
 * @mixins JSoop.mixins.Observable
 */
JSoop.define('Ramen.app.Helper', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable'
    },

    /**
     * Creates a new helper
     * @param {Object} config The config object
     */
    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');

        me.initHelper();
    },

    /**
     * Gets a reference to the Ramen.app.Application that created the parent controller.
     * @returns {Ramen.app.Application}
     */
    getApp: function () {
        return this.owner.app;
    },

    /**
     * @method
     * Called after the config has been applied
     * @template
     */
    initHelper: JSoop.emptyFn
});

/**
 * @class Ramen.app.History
 * @singleton
 * @mixins JSoop.mixins.Observable
 * Represents browser history state and is used to track changes in the browser history state. In general this class
 * should not be used, instead use {@link Ramen.app.Controller#routes routes} to moniter and execute code based on
 * browser state.
 */
JSoop.define('Ramen.app.History', {
    mixins: {
        observable: 'JSoop.mixins.Observable'
    },

    singleton: true,

    isStarted: false,
    interval: 50,

    constructor: function () {
        var me = this;

        me.initMixin('observable');
    },

    /**
     * @private
     */
    start: function () {
        var me = this,
            docMode, isOldIE, checkUrl;

        if (me.isStarted) {
            return;
        }

        me.isStarted = true;

        docMode = document.documentMode;
        isOldIE = (/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

        if (isOldIE) {
            me.createFrame();
            me.navigate(me.getFragment());
        }

        checkUrl = JSoop.bind(me.checkUrl, me);

        if (('onhashchange' in window) && !isOldIE) {
            jQuery(window).on('hashchange', checkUrl);
        } else {
            me.checkUrlInterval = setInterval(checkUrl, me.interval);
        }

        checkUrl();
    },

    /**
     * @private
     */
    createFrame: function () {
        var me = this,
            frame = Ramen.dom.Helper.create({
                tag: 'iframe',
                src: 'javascript:0',
                tabindex: '-1'
            });

        me.iframe = frame.hide().appendTo('body')[0].contentWindow;
    },

    /**
     * @method
     * Changes the current history state
     * @param {Object/string} config The config object or new fragment
     * @param {string} config.fragment The new fragment
     * @param {boolean} [config.silent=false] Whether or not to supress the change event
     * @param {boolean} [config.replace=false] Whether or not to replace the current history state
     */
    navigate: function (config) {
        var me = this,
            fragment;

        if (!me.isStarted) {
            return;
        }

        if (JSoop.isString(config)) {
            config = {
                fragment: config
            };
        }

        JSoop.applyIf(config, {
            silent: false,
            replace: false
        });

        // Strip the hash for matching.
        fragment = config.fragment.replace(/#.*$/, '');

        if (me.fragment === fragment) {
            return;
        }

        me.fragment = fragment;

        me.updateFragment(config.fragment, config.replace);

        if (!config.silent) {
            me.fireEvent('change', fragment);
        }
    },

    /**
     * @private
     */
    updateFragment: (function () {
        function updateLocation (location, fragment, replace) {
            if (replace) {
                location.replace(location.href.replace(/(javascript:|#).*$/, '') + '#' + fragment);
            } else {
                // Some browsers require that `hash` contains a leading #.
                location.hash = '#' + fragment;
            }
        }

        return function (fragment, replace) {
            var me = this,
                location = window.location,
                frameFragment, frameLocation;

            updateLocation(location, fragment, replace);

            if (me.frame) {
                frameLocation = me.frame.location;

                frameFragment = me.getHash(me.frame);
                frameFragment = me.getFragment(frameFragment);

                if (fragment !== frameFragment) {
                    if (!replace) {
                        me.frame.document.open().close();
                    }

                    updateLocation(frameLocation, fragment, location);
                }
            }
        };
    }()),

    /**
     * @method
     * Gets the current fragment
     * @returns {string} The current fragment
     */
    getFragment: function (fragment) {
        var me = this;

        if (!fragment) {
            fragment = me.getHash();
        }

        return fragment.replace(/^[#\/]|\s+$/g, '');
    },

    /**
     * @private
     */
    getHash: function (target) {
        var match = (target || window).location.href.match(/#(.*)$/);

        return match ? match[1] : '';
    },

    /**
     * @private
     */
    checkUrl: function () {
        var me = this,
            current = me.getFragment();

        if (current === me.fragment && me.frame) {
            current = me.getFragment(me.getHash(me.frame));
        }

        if (current === me.fragment) {
            return false;
        }

        me.fragment = current;

        if (me.frame) {
            me.navigate(current);
        }

        me.loadUrl();

        return true;
    },

    /**
     * @private
     */
    loadUrl: function () {
        var me = this,
            fragment = me.getFragment();

        /**
         * @event change
         * Fired when the history state changes
         * @param {string} fragment the new fragment
         */
        me.fireEvent('change', fragment);
    }
});

/**
 * @class Ramen.app.Route
 * @private
 * Represents a browser history state that can be used to execute code. This class shouldn't be instantiated directly.
 * Use {@link Ramen.app.Controller controllers} to create these along with their callbacks.
 * @mixins JSoop.mixins.Configurable
 */
JSoop.define('Ramen.app.Route', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    isRoute: true,

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);

        if (!me.name) {
            me.name = me.route;
        }

        me.initRoute();
    },

    initRoute: (function () {
        var optionalParam = /\((.*?)\)/g,
            namedParam    = /(\(\?)?:\w+/g,
            splatParam    = /\*\w+/g,
            escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

        return function () {
            var me = this,
                route = me.route;

            if (!JSoop.isRegExp(route)) {
                route = route.replace(escapeRegExp, '\\$&')
                    .replace(optionalParam, '(?:$1)?')
                    .replace(namedParam, function(match, optional) {
                        return optional ? match : '([^/?]+)';
                    })
                    .replace(splatParam, '([^?]*?)');

                me.route = new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
            }
        };
    }()),

    is: function (fragment) {
        var me = this;

        return me.route.test(fragment);
    },

    getParams: function (fragment) {
        var me = this,
            parts = me.route.exec(fragment).slice(1),
            params = [];

        JSoop.each(parts, function (part, index) {
            part = part || null;

            if (index === parts.length - 1) {
                params.push(part);

                return;
            }

            if (part !== null) {
                part = decodeURIComponent(part);
            }

            params.push(part);
        });

        return params;
    }
});

/**
 * @class Ramen.app.Router
 * @private
 * @mixins JSoop.mixins.Configurable
 * @mixins JSoop.mixins.Observable
 */
JSoop.define('Ramen.app.Router', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable'
    },

    isRouter: true,

    constructor: function (config) {
        var me = this,
            routes;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');

        routes = me.routes;
        me.routes = {};

        if (JSoop.isArray(routes)) {
            JSoop.each(routes, function (route) {
                me.add(route);
            });
        }

        me.initRouter();

        Ramen.app.History.on('change', me.onHistoryChange, me);
    },

    initRouter: JSoop.emptyFn,

    add: function (route) {
        var me = this,
            fragment = Ramen.app.History.getFragment();

        if (JSoop.isString(route)) {
            route = {
                route: route
            };
        }

        if (!route.isRoute) {
            JSoop.applyIf(route, {
                type: 'Ramen.app.Route'
            });

            route = JSoop.create(route.type, route);
        }

        me.routes[route.name] = route;

        if (route.is(fragment)) {
            me.fireEvent('route', route.route, route);
        }
    },

    remove: function (name) {
        delete this.routes[name];
    },

    onHistoryChange: function (fragment) {
        var me = this,
            routed = false;

        JSoop.iterate(me.routes, function (route, path) {
            if (route.is(fragment)) {
                if (me.fireEvent('route', me, path, route) === false) {
                    routed = true;

                    return false;
                }
            }
        });

        if (routed) {
            return false;
        }
    }
});

/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * @class Ramen.util.Renderable
 * @private
 */
JSoop.define('Ramen.util.Renderable', {
    isRenderable: true,

    createEl: function () {
        return Ramen.dom.Helper.create(this.getTagConfig());
    },

    getTagConfig: function () {
        var me = this,
            classes = JSoop.toArray(me.cls || []),
            tag;

        classes.push(me.baseCls);

        if (JSoop.isString(me.tag)) {
            tag = {
                tag: me.tag
            };
        } else {
            tag = JSoop.clone(me.tag || {});
        }

        JSoop.applyIf(tag, {
            tag: 'div',
            id: me.getId(),
            cls: classes,
            style: me.style || {}
        });

        return tag;
    },

    /**
     * Retrieves a template from the class. If the property with the given name is not a template, a template will be
     * created using the value of the property.
     * @param {String} name The name of the desired template
     * @returns {Ramen.util.Template}
     */
    getTemplate: function (name) {
        var me = this,
            tpl = me[name];

        if (tpl.isTemplate) {
            return tpl;
        }

        me[name] = JSoop.create('Ramen.util.Template', tpl);

        return me[name];
    },

    initChildSelectors: function () {
        var me = this,
            renderSelectors = me.renderSelectors || {},
            childSelectors = me.childSelectors || {}
            ,hasRenderSelectors = false
            ;

        JSoop.iterate(renderSelectors, function (selector, key) {
            hasRenderSelectors = true;
            //todo: detach from jquery
            me[key] = jQuery(selector, me.el);
        });

        if (hasRenderSelectors) {
            JSoop.log('renderSelectors being used in ' + me.$className + '. renderSelectors is depreciated, please use childSelectors instead');
        }

        JSoop.iterate(childSelectors, function (selector, key) {
            //todo: detach from jquery
            me[key] = jQuery(selector, me.el);
        });
    },

    initChildEls: function () {
        var me = this,
            id = me.getId(),
            els = me.childEls || {};

        JSoop.iterate(els, function (addition, key) {
            //todo: detach from jquery
            me[key] = jQuery('#' + id + '-' + addition, me.el);
        });
    },

    /**
     * Adds a css class to the element.
     * @param {String/String[]} classes The classes to add
     */
    addCls: function (classes) {
        var me = this;

        classes = JSoop.toArray(classes);

        if (!me.el) {
            if (!me.cls) {
                me.cls = [];
            } else {
                me.cls = JSoop.toArray(me.cls);
            }

            JSoop.each(classes, function (cls) {
                if (JSoop.util.Array.indexOf(me.cls, cls) === -1) {
                    me.cls.push(cls);
                }
            });

            return;
        }

        JSoop.each(classes, function (cls) {
            //todo: detach from jquery
            me.el.addClass(cls);
        });
    },
    /**
     * Removes a css class from the element.
     * @param {String/String[]} classes The classes to remove
     */
    removeCls: function (classes) {
        var me = this;

        classes = JSoop.toArray(classes);

        if (!me.el) {
            if (!me.cls) {
                return;
            } else {
                me.cls = JSoop.toArray(me.cls);
            }

            JSoop.each(classes, function (cls) {
                index = JSoop.util.Array.indexOf(me.cls, cls);

                if (index !== -1) {
                    me.cls.splice(index, 1);
                }
            });

            return;
        }

        JSoop.each(classes, function (cls) {
            //todo: detach from jquery
            me.el.removeClass(cls);
        });
    },
});

/**
 * @class Ramen.util.Template
 * A template that can be used to dynamically create content. Templates use the Twig templating language.
 */
//todo: detach from twig
JSoop.define('Ramen.util.Template', {
    isTemplate: true,
    /**
     * @param {String/String[]} tpl The desired template
     */
    constructor: function (tpl) {
        var me = this;

        if (JSoop.isArray(tpl)) {
            tpl = tpl.join('');
        }

        me.raw = tpl;

        me.initTemplate();
    },
    /**
     * @private
     */
    initTemplate: function () {
        var me = this;

        me.tpl = Twig.twig({
            data: me.raw
        });
    },
    /**
     * Renders the template using the given params.
     * @param {Object} params
     * @returns {String}
     */
    render: function (params) {
        return this.tpl.render(params);
    }
});

/**
 * @class Ramen.dom.Helper
 * A helper class that turns structured objects into HTMLElements or markup. A dom object consists of a tag, and then
 * any attributes you want to add to the tag. There are a few special keys that you can use:
 *
 *  - <strong>cls</strong> - is used to add css classes as `class` is a keyword in javascript, and can't be used as a key
 *  - <strong>style</strong> - can either be a string, or an object. A style object will be converted to valid
 *    css. Any appropriate numbers will have "px" added to them as units. You can also use nested objects for
 *    styles that have multiple properties for example "padding-left", "padding-right", etc can instead be written:
 *
 *        {
 *            padding: {
 *                top: 5
 *                left: 10,
 *                right: 10,
 *                bottom: 5
 *            }
 *        }
 *
 *  - <strong>html</strong> - will be applied to the innerHTML of the created tag
 *  - <strong>children</strong> - is an array of tag objects that will be added as children to the created tag.
 *
 *  The following is a correctly formatted object:
 *
 *      Ramen.dom.Helper.markup({
 *          tag: 'ul',
 *          cls: [
 *              'task-list',
 *              'important-list'
 *          ],
 *          style: {
 *              margin: {
 *                  top: 20
 *              }
 *          },
 *          children: [{
 *              tag: 'li',
 *              html: 'Write awesome app'
 *          }, {
 *              tag: 'li',
 *              html: '???'
 *          }, {
 *              tag: 'li',
 *              html: 'profit'
 *          }]
 *      });
 *
 * @singleton
 */
JSoop.define('Ramen.dom.Helper', {
    singleton: true,

    //todo: need to find a better list of singleton tags
    singletonRegEx: /^(br|hr|img|input|link|meta|param)$/,
    unitlessRegEx: /^(font-weight|z-index)$/,

    /**
     * Generates HTMLElements from the given tag object.
     * @param {Object} config The tag config
     * @returns {HTMLElement} The generated HTMLElements
     */
    create: function (config) {
        //todo: detach from jquery
        return jQuery(Ramen.dom.Helper.markup(config));
    },

    /**
     * Generates HTML markup from the given tag object.
     * @param {Object} config The tag config
     * @returns {String} The generated markup
     */
    markup: function (config) {
        var me = this,
            html = ['<' + config.tag];

        JSoop.iterate(config, function (value, attr) {
            switch (attr) {
                case 'html':
                    return;
                case 'children':
                    return;
                case 'tag':
                    return;
                case 'cls':
                    attr = 'class';
                    value = JSoop.toArray(value).join(' ');
                    break;
                case 'style':
                    value = Ramen.dom.Helper.parseStyle(value);
                    break;
            }

            html.push(attr + '="' + value + '"');
        });

        if (Ramen.dom.Helper.singletonRegEx.test(config.tag)) {
            html.push('/>');
        } else if (config.html) {
            html.push('>' + config.html + '</' + config.tag + '>');
        } else if (config.children) {
            html.push('>');

            JSoop.each(config.children, function (child) {
                html.push(me.markup(child));
            });

            html.push('</' + config.tag + '>');
        } else {
            html.push('></' + config.tag + '>');
        }

        //todo: detach from jquery
        return html.join(' ');
    },

    /**
     * @private
     * @param {Number} value
     * @returns {String}
     */
    addUnits: function (key, value) {
        if (JSoop.isNumber(value) && !this.unitlessRegEx.test(key)) {
            value = value + 'px';
        }

        return value;
    },

    /**
     * @private
     * @param {Object} obj
     * @returns {String}
     */
    parseStyle: function (obj) {
        var me = this,
            style = [];

        if (JSoop.isString(obj)) {
            return obj;
        }

        JSoop.iterate(obj, function (value, key) {
            if (JSoop.isObject(value)) {
                JSoop.iterate(value, function (subValue, subKey) {
                    style.push(key + '-' + subKey + ':' + me.addUnits(value));
                });
            } else {
                style.push(key + ':' + me.addUnits(key, value));
            }
        });

        return style.join(';');
    }
});

/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * @class Ramen.view.Box
 * The base for all views. In general, a box is a managed HTMLElement. For the most part, this class shouldn't need to
 * be used. Instead look at its subclasses as a better starting point for creating views:
 *
 *  - {@link Ramen.view.View}
 *  - {@link Ramen.view.binding.BindingView}
 *  - {@link Ramen.view.container.Container}
 *  - {@link Ramen.view.container.CollectionContainer}
 *
 * @mixins JSoop.mixins.Configurable
 * @mixins JSoop.mixins.Observable
 * @mixins JSoop.mixins.PluginManager
 * @mixins Ramen.util.Renderable
 */
JSoop.define('Ramen.view.Box', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable',
        pluginManager: 'JSoop.mixins.PluginManager',
        renderable: 'Ramen.util.Renderable'
    },

    /**
     * @property {String} rtype
     * An arbitrary used for locating the view via a {@link Ramen.view.Query}.
     */
    rtype: 'box',

    isBox: true,
    /**
     * @cfg
     * Determines whether or not the view should be placed into {@link Ramen.view.ViewManager}
     */
    isManaged: true,
    /**
     * @cfg
     * If set to `true` the view will be rendered on creation. This is used in cojunction with {@link #renderTo}
     */
    autoRender: false,
    /**
     * @cfg {String/Object}
     * The config object used by {@link Ramen.dom.Helper} to create the HTMLElement the box manages.
     */
    tag: null,
    /**
     * @cfg {String} renderTo
     * A css selector that points to where the box should be rendered to if no container is specified.
     */

    config: {
        required: [
            /**
             * @cfg {String} baseId
             * The ID prefix that will be used when creating the auto ID.
             */
            'baseId',
            /**
             * @cfg {String} baseCls
             * The base css class that will be applied to the managed HTMLElement
             */
            'baseCls'
        ]
    },

    /**
     * Creates a new box.
     * @param {Object} config The config object
     */
    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');
        me.initMixin('pluginManager');

        me.initView();

        me.id = me.getId();
        me.el = me.createEl();

        if (me.isManaged) {
            Ramen.view.ViewManager.add(me);
        }

        if (me.autoRender) {
            me.render(me.renderTo);
        }
    },
    /**
     * @method
     * Called after mixins have been setup, but before anything else.
     * @template
     */
    initView: JSoop.emptyFn,
    /**
     * Gets the ID of the box. If one is not set, it will be created using the {@link #baseId}.
     * @returns {String}
     */
    getId: function () {
        var me = this;

        if (!me.id) {
            me.id = Ramen.id(me.baseId);
        }

        return me.id;
    },
    /**
     * Renders the box and places it in the specified container.
     * @param {HTMLElement} container The container element to place the box into
     * @param {Number} [index]
     * The index to insert the box at, if this is ommited the box will be appended to the container
     */
    render: function (container, index) {
        var me = this;

        if (me.fireEvent('render:before', me, container, index) === false) {
            return;
        }

        me.fireEvent('render:during', me);

        me.addToContainer(container, index);

        me.isRendered = true;

        if (me.owner && !me.owner.isRendered) {
            me.mon(me.owner, 'render:after', function () {
                me.fireEvent('render:after', me);
            }, me, {
                single: true
            });
        } else {
            me.fireEvent('render:after', me);
        }
    },
    /**
     * @private
     * @param {HTMLElement} container
     * @param {Number} index
     */
    addToContainer: function (container, index) {
        var me = this;

        if (!container) {
            container = me.renderTo;
        }

        if (!container) {
            JSoop.error('Render requires either a container argument or a "renderTo" config value');
        }

        //todo: detach from jquery
        container = jQuery(container).eq(0);

        if (index === undefined || !container[0].childNodes[index]) {
            container.append(me.el);
        } else {
            container = container[0];

            container.insertBefore(me.el[0], container.childNodes[index]);
        }
    },
    /**
     * Destroys the box. This will remove the box from the dom and do any needed cleanup.
     */
    destroy: function () {
        var me = this;

        if (me.fireEvent('destroy:before') === false) {
            return false;
        }

        me.fireEvent('destroy', me);

        me.removeAllListeners();
        me.removeAllManagedListeners();
        me.destroyAllPlugins();

        //todo: detach from jquery
        me.el.remove();

        if (me.isManaged) {
            Ramen.view.ViewManager.remove(me);
        }
    },

    /**
     * @event destroyBefore
     * Fired before the box is destroyed.
     * @param {Ramen.view.Box} me The box that fired the event
     * @preventable
     */
    onDestroyBefore: JSoop.emptyFn,
    /**
     * @event destroy
     * Fired when the box is destroyed.
     * @param {Ramen.view.Box} me The box that fired the event
     */
    onDestroy: JSoop.emptyFn,
    /**
     * @event renderDuring
     * Fired at the beginning of the render process.
     * @param {Ramen.view.Box} me The box that fired the event
     */
    onRenderDuring: JSoop.emptyFn,
    /**
     * @event renderBefore
     * Fired before the render happens
     * @param {Ramen.view.Box} me The box that fired the event
     * @param {HTMLElement} container The container the box was tried to render to
     * @param {Number} index The index the box was tried to render to
     * @preventable
     */
    onRenderBefore: JSoop.emptyFn,
    /**
     * @event renderAfter
     * @param {Ramen.view.Box} me The box that fired the event
     */
    onRenderAfter: JSoop.emptyFn
});

/**
 * @class Ramen.view.View
 * A more advanced version of a {@link Ramen.view.Box} adding templating, dom events, and child elements. In most cases,
 * this is a good place to start when creating your own custom views.
 * @extends Ramen.view.Box
 */
JSoop.define('Ramen.view.View', {
    extend: 'Ramen.view.Box',

    isView: true,

    rtype: 'view',

    /**
     * @cfg {String/String[]}
     * The template used to render the view.
     */
    tpl: '',
    /**
     * @cfg {Object} domListeners
     * An object containing listener definitions for elements within the view. The keys of this object are names of
     * elements within the view, and the values are listener configs similar to those used by JSoop.mixins.Observable.
     * Elements must be present in either {@link #childEls} or {@link #childSelectors}.
     *
     * For example:
     *
     *      ...
     *      domListeners: {
     *          buttonEl: {
     *              click: {
     *                  fn: 'onButtonClick',
     *                  single: true
     *              }
     *              mouseover: 'onButtonOver',
     *              mouseout: 'onButtonOut'
     *          }
     *      },
     *      ...
     */
    /**
     * @cfg {Object} childEls
     * An object containing a listing on elements that the view needs references to once its template has been rendered.
     * They keys are the names of properties to store the elements as, and the values are pieces of ID's that, when
     * added to the ID of view, can be used to locate the elements in the DOM. For example:
     *
     *      ...
     *      tpl: '<button id="{{ id }}-btn"></button>',
     *      childEls: {
     *          buttonEl: 'btn'
     *      },
     *      ...
     */
    /**
     * @cfg {Object} childSelectors
     * Similar to {@link #childEls} this object contains property names as its keys and css selectors as its values. In
     * general, childEls should be used when selecting only a single element as it is more performant. However, when you
     * need a reference to groups of elements, childSelectors should be used. For example:
     *
     *      ...
     *      tpl: [
     *          '<ul>',
     *              '<li>Item 1</li>',
     *              '<li>Item 2</li>',
     *              '<li>Item 3</li>',
     *          '</ul>'
     *      ],
     *      childSelectors: {
     *          listEls: 'li'
     *      },
     *      ...
     */
    /**
     * @cfg {Object} renderData
     * This object will be passed to the template at render time. `baseCls` and `id` will be passed automatically.
     */

    baseCls: 'view',
    baseId: 'view',

    initView: function () {
        var me = this;

        me.renderData = me.renderData || {};

        me.callParent(arguments);
    },

    /**
     * @private
     * @param {Object} renderData
     * @returns {Object}
     */
    initRenderData: function (renderData) {
        var me = this;

        JSoop.applyIf(renderData, {
            id: me.getId(),
            baseCls: me.baseCls
        });

        return renderData;
    },

    onRenderDuring: function () {
        var me = this,
            renderData = me.initRenderData(me.renderData),
            tpl = me.getTemplate('tpl'),
            html = tpl.render(renderData);

        //todo: detach from jquery
        me.el.html(html);

        me.initChildSelectors();
        me.initChildEls();
        me.initDomListeners();
    },
    /**
     * @private
     * @param {HTMLElement} el
     * @param {String} ename
     * @param {Object} listener
     */
    addDomListener: function (el, ename, listener) {
        if (listener.single) {
            listener.callFn = function () {
                var ret = listener.fn.apply(listener.scope, arguments);

                //todo: detach from jquery
                el.unbind(ename, listener.callFn);

                return ret;
            };
        }

        //todo: detach from jquery
        el.bind(ename, listener.callFn);
    },
    /**
     * @private
     * @param {String} ename
     * @param {Function/String} listener
     * @param {Object} defaults
     * @returns {Object}
     */
    initDomListener: function (ename, listener, defaults) {
        var me = this;

        if (!JSoop.isObject(listener)) {
            listener = {
                fn: listener
            };
        }

        if (JSoop.isString(listener.fn)) {
            listener.fn = me[listener.fn];
        }

        JSoop.applyIf(listener, defaults || {});
        JSoop.applyIf(listener, {
            scope: me
        });

        listener.fn = listener.callFn = JSoop.bind(listener.fn, listener.scope);

        return listener;
    },
    /**
     * @private
     */
    initDomListeners: function () {
        var me = this,
            domListeners = me.domListeners || {};

        JSoop.iterate(domListeners, function (events, el) {
            var defaultOptions = {};

            JSoop.iterate(events, function (listeners, ename) {
                if (ename === 'single' || ename === 'scope') {
                    defaultOptions[ename] = listeners;
                }
            });

            JSoop.iterate(events, function (listeners, ename) {
                if (ename === 'single' || ename === 'scope') {
                    return;
                }

                listeners = JSoop.toArray(listeners);

                JSoop.each(listeners, function (listener) {
                    listener = me.initDomListener(ename, listener, defaultOptions);
                    me.addDomListener(me[el], ename, listener);
                });
            });
        });
    },

    destroy: function () {
        var me = this,
            renderSelectors = me.renderSelectors || {},
            els = me.childEls || {};

        //Unbind and destroy renderSelectors
        JSoop.iterate(renderSelectors, function (selector, key) {
            //todo: detach from jquery
            me[key].off();
            me[key] = null;
        });

        //Unbind and destroy childEls
        JSoop.iterate(els, function (addition, key) {
            //todo: detach from jquery
            me[key].off();
            me[key] = null;
        });

        me.callParent();
    }
});

(function () {
    var regex = {
            op: /^[>^]$/,
            bool: /^(true|false)$/,
            selector: /^([^[]+)(\[(.+?)=(.+?)])?$/,
            term: /\s/
        },
        Query = function (selector) {
            var me = this;

            me.raw = selector;
            me.tree = [];

            me.parse();
        };

    Query.prototype = {
        parse: function () {
            var me = this,
                raw = me.raw.replace(/^\s+|\s+$/g, ''),
                stack = raw.split(''),
                token = '',
                stringOpen = false,
                c;

            while (stack.length) {
                c = stack.shift();

                if (regex.term.test(c) && !stringOpen) {
                    if (token.length > 0) {
                        me.processToken(token);

                        token = '';
                    }
                } else {
                    token = token + c;

                    if (c === '"' || c === "'") {
                        if (stringOpen && stringOpen === c) {
                            stringOpen = false;
                        } else if (!stringOpen) {
                            stringOpen = c;
                        }
                    }
                }
            }

            if (token.length > 0) {
                me.processToken(token);
            }
        },

        processToken: function (token) {
            var me = this;

            if (regex.op.test(token)) {
                me.addOp(token);
            } else if (regex.selector.test(token)) {
                me.addSelector(token);
            } else {
                JSoop.error('Selector improperly formed "' + me.raw.trim() + '"');
            }
        },

        addOp: function (op) {
            var me = this;

            me.tree.push(op);
        },

        addSelector: function (selector) {
            var me = this,
                match = regex.selector.exec(selector),
                type = match[1],
                attribute = match[3],
                value = match[4],
                fn = ['if (view.rtype !== \'' + type + '\') { return false; }'];

            if (attribute && !value) {
                fn.push('if (!view[\'' + attribute + '\']) { return false; }');
            }

            if (attribute && value) {
                fn.push('if (view[\'' + attribute + '\'] !== ' + value + ') { return false; }')
            }

            fn.push('return true;');

            fn = new Function('view', fn.join('\n'));

            me.tree.push(fn);
        },

        is: function (view) {
            var me = this,
                checking = view,
                currentOp = '',
                found = false,
                fn = me.tree[me.tree.length - 1],
                i;

            //check current view
            if (!fn(checking)) {
                return false;
            }

            //check any parent requirements
            for (i = me.tree.length - 2; i >= 0; i = i - 1) {
                fn = me.tree[i];

                if (JSoop.isFunction(fn)) {
                    checking = checking.owner;

                    if (!checking) {
                        return false;
                    }

                    if (currentOp === '') {
                        found = false;

                        do {
                            if (!fn(checking)) {
                                checking = checking.owner;
                            } else {
                                found = true;
                                break;
                            }
                        } while (checking);

                        if (!found) {
                            return false;
                        }
                    } else if (currentOp === '>') {
                        if (!fn(checking)) {
                            return false;
                        }
                    }

                    currentOp = '';
                } else {
                    currentOp = fn;
                }
            }

            return true;
        },

        execute: function () {
            var me = this,
                manager = Ramen.view.Manager,
                views = [];

            manager.each(function (view) {
                if (me.is(view)) {
                    views.push(view);
                }
            });

            return views;
        }
    };

    /**
     * @class Ramen.view.Query
     * Allows the querying of any objects the inherit from {@link Ramen.view.Box} in a css-like syntax based on
     * {@link Ramen.view.Box#rtype rtype} as the tag name.
     * @singleton
     */
    JSoop.define('Ramen.view.Query', {
        singleton: true,

        /**
         * Creates a pre-parsed version of the given query for quick use. If you're going to be doing a lot of checking
         * make sure you use this instead of {@link #is}.
         * @param {String} selector
         * @returns {Query}
         */
        parse: function (selector) {
            return new Query(selector);
        },

        /**
         * Checks the given view to see if it matches the given selector. If you're going to be using the selector a lot
         * it's better to store a parsed version of it using {@link #parse} and then call `is` directly on that object.
         * @param {Ramen.view.Box} view The view to check
         * @param {String} selector The query to check the view against
         * @returns {Boolean} Whether or not the view matches
         */
        is: function (view, selector) {
            var query = new Query(selector);

            return query.is(view);
        }
    });
}());

/**
 * @class Ramen.view.ViewManager
 * @extends Ramen.collection.Dictionary
 */
JSoop.define('Ramen.view.ViewManager', {
    extend: 'Ramen.collection.Dictionary',

    singleton: true,

    getKey: function (item) {
        return item.getId();
    }
});

/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * @class Ramen.view.binding.Binding
 * Represents a living piece of data within a view. It will update it's display when something changes. The most common
 * form of binding is {@link Ramen.view.binding.ModelBinding}.
 * @mixins JSoop.mixins.Configurable
 * @mixins JSoop.mixins.Observable
 * @mixins Ramen.util.Renderable
 */
JSoop.define('Ramen.view.binding.Binding', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable',
        renderable: 'Ramen.util.Renderable'
    },

    isBinding: true,

    /**
     * The base class applied to the containing element and passed to the template
     */
    baseCls: 'binding',

    /**
     * The template used to render content
     */
    tpl: '{{ content }}',

    /**
     * @param {Object} config
     */
    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');

        me.initBinding();

        if (me.owner) {
            me.attach();
        }
    },

    /**
     * @private
     */
    attach: function () {
        var me = this;

        me.mon(me.owner, {
            'render:before': me.onOwnerRenderBefore,
            'render:during': me.onOwnerRenderDuring,
            scope: me,
            single: true
        });
    },

    /**
     * @method
     * @template
     */
    initBinding: JSoop.emptyFn,

    /**
     * @returns {String}
     */
    getId: function () {
        var me = this;

        if (!me.id) {
            me.id = Ramen.id('binding');
        }

        return me.id;
    },

    /**
     * Retrieves the complete markup for the binding that needs to be inserted into a view. The includes the wrapping
     * element as well as the rendered template.
     * @returns {String}
     */
    getHtml: function () {
        var me = this,
            tag = me.getTagConfig();

        tag.html = me.getContent();

        return Ramen.dom.Helper.markup(tag);
    },

    /**
     * Retrieves the content of the binding.
     * @returns {String}
     */
    getContent: function () {
        var me = this,
            renderData = me.getRenderData();

        if (!JSoop.isObject(renderData)) {
            renderData = {
                content: renderData
            };
        }

        JSoop.applyIf(renderData, {
            id: me.getId(),
            baseCls: me.baseCls
        });

        return me.getTemplate('tpl').render(renderData);
    },

    /**
     * @private
     * @returns {String}
     */
    getRenderData: function () {
        return '';
    },

    /**
     * This needs to be called whenever the binding needs to update its content.
     */
    update: function () {
        var me = this;

        setTimeout(function () {
            me.el.html(me.getContent());
        }, 0);
    },

    /**
     * Destroys the binding. This does not remove the HTMLElement associated with the binding. This should be done by
     * the view managing the binding.
     */
    destroy: function () {
        var me = this;

        me.removeAllListeners();
        me.removeAllManagedListeners();
    },

    /**
     * @private
     * @param {Ramen.view.Box} view
     */
    onOwnerRenderBefore: function (view) {
        var me = this;

        view.renderData[me.token] = me.getHtml();
    },

    /**
     * @private
     */
    onOwnerRenderDuring: function () {
        var me = this;

        //todo: detach from jquery
        me.el = me.owner.el.find('#' + me.getId());

        me.initChildSelectors();
        me.initChildEls();

        me.update();
    }
});

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

        if (JSoop.isString(me.model)) {
            me.model = me.owner[me.model];
        }

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

        if (!me.watchingFields) {
            me.watchingFields = [];
        }

        if (!me.watchingAssociations) {
            me.watchingAssociations = [];
        }

        //this looks for field changes
        for (match = parser.exec(fn); match; match = parser.exec(fn)) {
            if (JSoop.util.Array.indexOf(watching, match[1]) === -1) {
                watching.push(match[1]);
            }
        }

        me.watchingFields = me.watchingFields.concat(watching);

        parser = /\.get([A-Z][a-zA-Z0-9]*)\(.*\)/g;
        watching = [];

        for (match = parser.exec(fn); match; match = parser.exec(fn)) {
            if (JSoop.util.Array.indexOf(watching, match[1]) === -1) {
                watching.push(match[1]);
            }
        }

        me.watchingAssociations = me.watchingAssociations.concat(watching);
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

/**
 * @class Ramen.view.binding.BindingView
 * A special view that allows the use of {@link #bindings}.
 * @extends Ramen.view.View
 */
JSoop.define('Ramen.view.binding.BindingView', {
    extend: 'Ramen.view.View',

    /**
     * @cfg {Ramen.view.binding.Binding[]/Object[]} bindings
     * An object containing binding configs that will be used to create {@link Ramen.view.binding.Binding}'s. If the
     * value is just a function, the view will assume that it is a formatter.
     *
     * Each binding will receive the following if they are not already set:
     *
     *  - **type** - {@link Ramen.view.binding.ModelBinding} will be used
     *  - **owner** - the current view
     *  - **token** - the key of the original object
     *
     * For example:
     *
     *      ...
     *      tpl: [
     *          '{{ name }}',
     *          '{{ address }}',
     *          '{{ total }}'
     *      ],
     *      bindings: {
     *          name: 'name',
     *          address: function (model) {
     *              return model.get('street') + ' ' +
     *                     model.get('city') + ', ' +
     *                     model.get('state') + ' ' +
     *                     model.get('zip');
     *          },
     *          total: {
     *              type: 'Demo.binding.Total'
     *          }
     *      },
     *      ...
     */
    /**
     * @cfg {Ramen.data.Model} model
     * The model that this view manages.
     */

    render: function () {
        var me = this;

        me.initBindings();

        me.callParent(arguments);
    },

    /**
     * @private
     */
    initBindings: function () {
        var me = this,
            bindings = JSoop.clone(me.bindings || {}),
            myModel = me.getModel();

        me.bindings = {};

        JSoop.iterate(bindings || {}, function (binding, key) {
            var model;

            if (JSoop.isString(binding)) {
                binding = {
                    field: binding
                };
            } else if (JSoop.isFunction(binding)) {
                binding = {
                    formatter: binding
                };
            }

            model = binding.model || myModel;

            if (JSoop.isString(model)) {
                model = JSoop.getValue(me[model], me);
            }

            if (!binding.isBinding) {
                JSoop.applyIf(binding, {
                    type: 'Ramen.view.binding.ModelBinding',
                    token: key,
                    owner: me
                });

                binding.model = model;

                binding = JSoop.create(binding.type, binding);
            } else {
                binding.owner = me;
                binding.model = model;

                binding.attach();
            }

            me.bindings[key] = binding;
        });
    },
    /**
     * Retrieves the managed model.
     * @returns {Ramen.data.Model}
     */
    getModel: function () {
        return this.model;
    },

    onDestroy: function () {
        var me = this;

        JSoop.iterate(me.bindings, function (binding) {
            binding.destroy();
        });

        me.callParent(arguments);
    }
});

/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * @class Ramen.view.layout.Layout
 * @extends Ramen.view.Box
 */
JSoop.define('Ramen.view.layout.Layout', {
    extend: 'Ramen.view.Box',

    isLayout: true,

    isManaged: false,

    baseCls: 'layout',
    baseId: 'layout',

    /**
     * @cfg {String/Object}
     */
    wrapperTag: null,
    /**
     * @cfg {String}
     */
    wrapperCls: '',

    constructor: function () {
        var me = this;

        me.callParent(arguments);

        me.initLayout();

        me.itemCache = JSoop.create('Ramen.collection.Dictionary', null, {
            getKey: function (item) {
                return item.getId();
            },
            listeners: {
                add: me.onItemsAdd,
                remove: me.onItemsRemove,
                sort: me.onItemsSort,
                scope: me
            }
        });

        me.mon(me.owner.items, {
            add: me.onOwnerItemsAdd,
            remove: me.onOwnerItemsRemove,
            sort: me.onOwnerItemsSort,
            scope: me
        });

        me.mon(me.owner, {
            'render:during': me.renderItems,
            'render:after': me.doLayout,
            scope: me,
            single: true
        });

        me.wrapperCache = {};
    },

    /**
     * @method
     * @template
     */
    initLayout: JSoop.emptyFn,
    /**
     * @method
     * @template
     */
    initContainer: JSoop.emptyFn,
    doLayout: function () {
        var me = this;

        if (me.fireEvent('layout:before', me) === false) {
            return;
        }

        me.fireEvent('layout:during', me);

        me.fireEvent('layout:after', me);
    },
    /**
     * @param {Ramen.view.Box[]} items
     */
    add: function (items) {
        var me = this;

        me.itemCache.add(items);
    },
    /**
     * @param {Ramen.view.Box[]} items
     * @param {Number} index
     */
    insert: function (items, index) {
        var me = this;

        me.itemCache.insert(items, index);
    },
    /**
     * @param {Ramen.view.Box[]} items
     */
    remove: function (items) {
        var me = this;

        me.itemCache.remove(items);
    },
    /**
     * @private
     */
    renderItems: function () {
        var me = this;

        if (!me.needsRender) {
            return;
        }

        me.initContainer();

        me.itemCache.each(function (item, index) {
            var key = me.getItemId(item),
                wrapper = me.createWrapper(item, index);

            me.wrapperCache[key] = wrapper;

            item.render(wrapper);
        });
    },
    /**
     * @param {Ramen.view.Box} item
     * @returns {String}
     */
    getItemId: function (item) {
        return this.itemCache.getKey(item);
    },
    /**
     * @private
     * @param {Ramen.view.Box} item
     * @param {Number} index
     * @returns {HTMLElement}
     */
    createWrapper: function (item, index) {
        var me = this,
            tag = JSoop.clone(me.wrapperTag || {
                tag: 'div'
            }),
            classes = me.getWrapperClasses(item, index),
            container = me.owner.getTargetEl(),
            wrapper;

        if (JSoop.isString(tag)) {
            tag = {
                tag: tag
            };
        }

        JSoop.applyIf(tag, {
            cls: classes,
            style: me.getWrapperStyle(item, index)
        });

        wrapper = Ramen.dom.Helper.create(tag);

        if (index === undefined || !container[0].childNodes[index]) {
            container.append(wrapper);
        } else {
            container = container[0];

            container.insertBefore(wrapper[0], container.childNodes[index]);
        }

        return wrapper;
    },
    /**
     * @param {Ramen.view.Box} item
     * @returns {String[]}
     */
    getWrapperClasses: function (item) {
        var me = this,
            classes = [me.wrapperCls];

        if (item.wrapperCls) {
            classes = classes.concat(JSoop.toArray(item.wrapperCls));
        }

        return classes;
    },
    /**
     * @param {Ramen.view.Box} item
     * @returns {Object}
     */
    getWrapperStyle: function (item) {
        var style = {},
            keys = [
                'width',
                'height',
                'padding',
                'margin'
            ];

        JSoop.each(keys, function (key) {
            if (item[key] !== undefined) {
                style[key] = item[key];
            }
        });

        JSoop.apply(style, item.wrapperStyle || {});

        return style;
    },

    /**
     * Gets the wrapper element associated with the given item.
     * @param {Ramen.view.Box} item
     * @returns {HTMLElement}
     */
    getWrapperEl: function (item) {
        var me = this;

        return me.wrapperCache[me.getItemId(item)];
    },

    destroy: function () {
        var me = this;

        if (me.callParent(arguments) !== false) {
            me.itemCache.removeAll();
        }
    },
    /**
     * @private
     * @param {Ramen.collection.Dictionary} collection
     * @param {Ramen.view.Box[]} added
     */
    onItemsAdd: function (collection, added) {
        var me = this;

        if (!me.owner.isRendered) {
            me.needsRender = true;

            return;
        }

        JSoop.each(added, function (item) {
            var key = me.getItemId(item),
                index = me.itemCache.indexOf(item),
                wrapper = me.createWrapper(item, index);

            me.wrapperCache[key] = wrapper;

            item.render(wrapper);
        });

        me.doLayout();
    },
    /**
     * @private
     * @param {Ramen.collection.Dictionary} collection
     * @param {Ramen.view.Box[]} removed
     */
    onItemsRemove: function (collection, removed) {
        var me = this;

        JSoop.each(removed, function (item) {
            var key = me.getItemId(item),
                wrapper = me.wrapperCache[key];

            delete me.wrapperCache[key];

            //todo: detach from jquery
            wrapper.remove();

            item.destroy();
        });

        me.doLayout();
    },
    /**
     * @private
     */
    onItemsSort: function () {
        var me = this,
            container = me.owner.getTargetEl();

        me.itemCache.each(function (item, index) {
            var key = me.getItemId(item),
                wrapper = me.wrapperCache[key];

            if (index === undefined || !container[0].childNodes[index]) {
                container.append(wrapper);
            } else {
                container[0].insertBefore(wrapper[0], container[0].childNodes[index]);
            }
        });

        me.doLayout();
    },
    /**
     * @private
     * @param {Ramen.collection.Dictionary} collection
     * @param {Ramen.view.Box[]} items
     */
    onOwnerItemsAdd: function (collection, items) {
        var me = this;

        JSoop.each(items, function (item) {
            var index = collection.indexOf(item);

            me.itemCache.insert(item, index);
        });
    },
    /**
     * @private
     * @param {Ramen.collection.Dictionary} collection
     * @param {Ramen.view.Box[]} items
     */
    onOwnerItemsRemove: function (collection, items) {
        this.itemCache.remove(items);
    },
    /**
     * @private
     */
    onOwnerItemsSort: function () {
        var me = this;

        me.itemCache.sort(me.owner.items.sortFn);
    },

    onLayoutBefore: JSoop.emptyFn,
    onLayoutDuring: JSoop.emptyFn,
    onLayoutAfter: JSoop.emptyFn
});

/**
 * @class Ramen.view.layout.NoLayout
 * @extends Ramen.view.layout.Layout
 */
JSoop.define('Ramen.view.layout.NoLayout', {
    extend: 'Ramen.view.layout.Layout',

    renderItems: function () {
        var me = this;

        if (!me.needsRender) {
            return;
        }

        me.initContainer();

        me.itemCache.each(function (item, index) {
            var key = me.getItemId(item),
                wrapper = me.createWrapper(item, index);

            me.wrapperCache[key] = wrapper;

            item.render(me.owner.getTargetEl());
        });
    },

    createWrapper: function (item) {
        return item.el;
    },

    onItemsAdd: function (collection, added) {
        var me = this;

        if (!me.owner.isRendered) {
            me.needsRender = true;

            return;
        }

        JSoop.each(added, function (item) {
            var key = me.getItemId(item),
                index = me.itemCache.indexOf(item),
                wrapper = me.createWrapper(item, index);

            me.wrapperCache[key] = wrapper;

            item.render(me.owner.getTargetEl(), index);
        });
    }
});

/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * @class Ramen.view.container.Container
 * A special view that is used to render other views within it.
 * @extends Ramen.view.View
 */
JSoop.define('Ramen.view.container.Container', {
    extend: 'Ramen.view.View',

    isContainer: true,

    rtype: 'container',

    baseCls: 'container',
    baseId: 'container',

    /**
     * @cfg {Ramen.view.Box[]/Object[]} items
     * An array of items that should be rendered into the container. Each created item will be given an `owner` property
     * that points to the container.
     */
    /**
     * @cfg {Object} itemDefaults
     * The items in this object will be applied to every item in the container if they don't already have them.
     */
    /**
     * @cfg {Ramen.view.layout.Layout/String/Object}
     * The layout that should be used when rendering items.
     */
    layout: 'Ramen.view.layout.Layout',
    /**
     * @cfg {String} [targetEl]
     * The element reference to render elements into. The element reference must be defined in {@link #childEls}.
     * If this isn't set, then the base `el` will be used.
     */
    targetEl: null,

    initView: function () {
        var me = this,
            items = me.items;

        me.callParent(arguments);

        me.items = JSoop.create('Ramen.collection.Dictionary', null, {
            getKey: function (item) {
                return item.getId();
            }
        });

        me.initLayout();

        if (items) {
            me.add(items);
        }
    },

    /**
     * @private
     */
    initLayout: function () {
        var me = this,
            layout = JSoop.clone(me.layout || {});

        if (JSoop.isString(layout)) {
            layout = {
                type: layout
            };
        }

        JSoop.applyIf(layout, me.layout || {});
        JSoop.applyIf(layout, {
            type: 'Ramen.view.layout.Layout'
        });

        layout.owner = me;

        me.layout = JSoop.create(layout.type, layout);

        me.mon(me.layout, {
            'layout:before': function () {
                return me.fireEvent('layout:before', me);
            },
            'layout:during': function () {
                me.fireEvent('layout:during', me);
            },
            'layout:after': function () {
                me.fireEvent('layout:after', me);
            },
            scope: me
        });
    },

    /**
     * @private
     * @param {Ramen.view.Box[]/Object[]} items
     * @returns {Ramen.view.Box[]}
     */
    initItems: function (items) {
        var me = this;

        items = JSoop.toArray(items);

        JSoop.each(items, function (item, index) {
            item = me.initItem(item);

            if (!item) {
                return;
            }

            items[index] = item;
        });

        return items;
    },

    /**
     * @private
     * @param {Ramen.view.Box/Object} item
     * @returns {Ramen.view.Box}
     */
    initItem: function (item) {
        var me = this;

        if (item.isBox) {
            item.owner = me;

            return item;
        }

        JSoop.applyIf(item, JSoop.clone(me.itemDefaults || {}));
        JSoop.applyIf(item, {
            type: 'Ramen.view.View'
        });

        item.owner = me;

        item = JSoop.create(item.type, item);

        return item;
    },

    /**
     * @private
     */
    getTargetEl: function () {
        var me = this;

        if (me.targetEl && me[me.targetEl]) {
            return me[me.targetEl];
        }

        return me.el;
    },

    /**
     * Adds an item to the end of the container.
     * @param {Ramen.view.Box[]/Object[]} items The item or items to add
     */
    add: function (items) {
        var me = this;

        items = me.initItems(items);

        me.items.add(items);
    },

    /**
     * Removes an item from the container. This will destroy the item.
     * @param {Ramen.view.Box[]} items The item or items to remove
     */
    remove: function (items) {
        this.items.remove(items);
    },

    /**
     * Inserts a view at the specified index.
     * @param {Ramen.view.Box[]/Object[]} items The item or items to insert
     * @param {Number} index The index to insert the items at
     */
    insert: function (items, index) {
        var me = this;

        items = me.initItems(items);

        me.items.insert(items, index);
    },

    onDestroy: function () {
        var me = this;

        me.items.removeAll();

        me.layout.destroy();

        me.callParent(arguments);
    },

    /**
     * Locates children views that matches the given query. This is not a recursive search.
     * @param {Ramen.view.Query/String} query The query to use when searching
     * @returns {Ramen.view.Box[]}
     */
    find: function (query) {
        var me = this,
            found = [];

        query = Ramen.view.Query.parse(query);

        me.items.each(function (item) {
            if (query.is(item)) {
                found.push(item);
            }
        });

        return found;
    },

    /**
     * Locates the first child view that matches the given query.
     * @param {Ramen.view.Query/String} query The query to use when searching
     * @returns {Ramen.view.Box}
     */
    findFirst: function (query) {
        var me = this;

        return me.find(query).shift();
    },

    /**
     * Locates the last child view that matches the given query.
     * @param {Ramen.view.Query/String} query The query to use when searching
     * @returns {Ramen.view.Box}
     */
    findLast: function (query) {
        var me = this;

        return me.find(query).pop();
    },

    doLayout: function () {
        this.layout.doLayout();
    },

    onLayoutBefore: JSoop.emptyFn,
    onLayoutDuring: JSoop.emptyFn,
    onLayoutAfter: JSoop.emptyFn
});

/**
 * @class Ramen.view.container.CollectionContainer
 * A collection container is a special container that will create a child view for every element within a
 * {@link Ramen.data.Collection}, as well as react to any changes to said collections such as sorting or filtering.
 * @extends Ramen.view.container.Container
 */
JSoop.define('Ramen.view.container.CollectionContainer', {
    extend: 'Ramen.view.container.Container',

    rtype: 'collection-container',

    /**
     * @cfg {Ramen.view.Box/Object} emptyView
     * The view to show when no items are in the collection
     */
    /**
     * @cfg {Ramen.data.Collection} collection
     * The collection this view is listening to.
     */
    /**
     * @cfg {Boolean}
     * Setting this to `true` will stop the {@link #emptyView} from being displayed.
     */
    suppressEmptyView: false,

    initView: function () {
        var me = this;

        //Collection container's should not have their own items, the collection should be controlling this
        me.items = JSoop.clone(me.collection.items);
        me.itemCache = {};

        me.callParent(arguments);

        me.initEmptyView();

        me.mon(me.collection, {
            add: me.onCollectionAdd,
            remove: me.onCollectionRemove,
            sort: me.onCollectionSort,
            filter: me.onCollectionFilter,
            scope: me
        });
    },

    initItem: function (item) {
        var me = this;

        if (!item.isModel) {
            JSoop.error(me.$className + '::initItem must be called with a model');
        }

        item = {
            model: item
        };

        item = me.callParent([item]);

        me.itemCache[me.collection.getKey(item.model)] = item;

        return item;
    },

    onDestroy: function () {
        var me = this;

        me.callParent(arguments);

        me.emptyView = null;
    },

    /**
     * @private
     */
    initEmptyView: function () {
        var me = this,
            emptyView;

        if (!me.emptyView) {
            return;
        }

        if (!me.emptyView.isBox) {
            emptyView = JSoop.clone(me.emptyView);

            //empty view doesn't have a model, so we need to bypass CollectionContainer::initItem
            emptyView = Ramen.view.container.Container.prototype.initItem.call(me, emptyView);

            me.emptyView = emptyView;
        }

        //hide the empty view by default
        me.mon(me.emptyView, 'render:during', me.hideEmptyView, me, {single: true});

        me.items.add(emptyView);
    },

    /**
     * Shows the {@link #emptyView}.
     */
    showEmptyView: function () {
        var me = this;

        if (!me.emptyView) {
            return;
        }

        //todo: detatch from jquery
        me.emptyView.el.show();
    },

    /**
     * Hides the {@link #emptyView}.
     */
    hideEmptyView: function () {
        var me = this;

        if (!me.emptyView) {
            return;
        }

        //todo: detatch from jquery
        me.emptyView.el.hide();
    },

    /**
     * @private
     * @returns {Function}
     */
    createItemSortFn: function () {
        var me = this,
            collection = me.collection;

        return function (item1, item2) {
            return collection.sortFn(item1.model, item2.model);
        };
    },

    /**
     * @private
     * @param {Ramen.data.Collection} collection
     * @param {Ramen.data.Model[]} added
     */
    onCollectionAdd: function (collection, added) {
        var me = this;

        JSoop.each(added, function (item) {
            var index = collection.indexOf(item);

            me.insert(item, index);
        });

        me.hideEmptyView();
    },

    /**
     * @private
     * @param {Ramen.data.Collection} collection
     * @param {Ramen.data.Model[]} removed
     */
    onCollectionRemove: function (collection, removed) {
        var me = this;

        JSoop.each(removed, function (item) {
            var key = collection.getKey(item);

            me.items.remove(me.itemCache[key]);

            delete me.itemCache[key];
        });

        if (collection.getCount() === 0 && !me.suppressEmptyView) {
            me.showEmptyView();
        }
    },

    /**
     * @private
     */
    onCollectionSort: function () {
        var me = this;

        me.items.sort(me.createItemSortFn());
    },

    /**
     * @private
     * @param {Ramen.data.Collection} collection
     * @param {Ramen.data.Model[]} filtered
     * @param {Ramen.data.Model[]} unfiltered
     */
    onCollectionFilter: function (collection, filtered, unfiltered) {
        var me = this,
            removed = [],
            added = [];

        JSoop.each(unfiltered, function (item) {
            if (collection.indexOf(item) === -1) {
                removed.push(item);
            }
        });

        collection.iterate(function (item, id) {
            if (!me.itemCache[id]) {
                added.push(item);
            }
        });

        if (removed.length > 0) {
            me.onCollectionRemove(collection, removed);
        }

        if (added.length > 0) {
            me.onCollectionAdd(collection, added);
        }

        if (collection.getCount() === 0 && !me.suppressEmptyView) {
            me.showEmptyView();
        } else {
            me.hideEmptyView();
        }
    }
});

/**
 * @class Ramen.view.container.Viewport
 * A viewport is a special container that allows you to {@link #replace} all of its children with a new set of children.
 * @extends Ramen.view.container.Container
 */
JSoop.define('Ramen.view.container.Viewport', {
    extend: 'Ramen.view.container.Container',

    rtype: 'viewport',
    baseId: 'viewport',
    baseCls: 'viewport',

    /**
     * @param {Ramen.view.Box/Object} items
     */
    replace: function (items) {
        var me = this;

        me.items.removeAll();

        me.add(items);
    }
});

