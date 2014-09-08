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
        me.destroyPlugins();
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
