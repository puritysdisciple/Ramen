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
