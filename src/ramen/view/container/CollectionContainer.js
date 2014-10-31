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

        //<debug>
        if (!item.isModel) {
            JSoop.error(me.$className + '::initItem must be called with a model');
        }
        //</debug>

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
