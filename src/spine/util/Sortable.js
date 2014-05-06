JSoop.define('Spine.util.Sortable', {
    isSortable: true,
    sortTarget: 'items',
    isSorted: false,

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

    sort: function (fn) {
        var me = this;

        me[me.sortTarget].sort(fn);

        me.isSorted = true;
        me.sortFn = fn;

        me.afterSort(me, me[me.sortTarget]);
    },

    clearSort: function () {
        var me = this;

        me.isSorted = false;

        delete me.sortFn;
    },

    afterSort: JSoop.emptyFn
});
