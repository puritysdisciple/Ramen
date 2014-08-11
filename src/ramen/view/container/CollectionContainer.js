JSoop.define('Ramen.view.container.CollectionContainer', {
    extend: 'Ramen.view.container.Container',

    stype: 'collection-container',
    supressEmptyView: false,

    initView: function () {
        var me = this;

        //Collection container's should not have their own items, the collection should be controlling this
        me.items = me.collection.items;
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
        me.emptyView.on('render:during', me.hideEmptyView, me, {single: true});

        me.items.add(emptyView);
    },

    showEmptyView: function () {
        var me = this;

        if (!me.emptyView) {
            return;
        }

        //todo: detatch from jquery
        me.emptyView.el.show();
    },

    hideEmptyView: function () {
        var me = this;

        if (!me.emptyView) {
            return;
        }

        //todo: detatch from jquery
        me.emptyView.el.hide();
    },

    createItemSortFn: function () {
        var me = this,
            collection = me.collection;

        return function (item1, item2) {
            return collection.sortFn(item1.model, item2.model);
        };
    },

    onCollectionAdd: function (collection, added) {
        var me = this;

        JSoop.each(added, function (item) {
            var index = collection.indexOf(item);

            me.insert(item, index);
        });

        me.hideEmptyView();
    },

    onCollectionRemove: function (collection, removed) {
        var me = this;

        JSoop.each(removed, function (item) {
            var key = collection.getKey(item);

            me.items.remove(me.itemCache[key]);

            delete me.itemCache[key];
        });

        if (collection.getCount() === 0 && !me.supressEmptyView) {
            me.showEmptyView();
        }
    },

    onCollectionSort: function () {
        var me = this;

        me.items.sort(me.createItemSortFn());
    },

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

        if (collection.getCount() === 0 && !me.supressEmptyView) {
            me.showEmptyView();
        } else {
            me.hideEmptyView();
        }
    }
});
