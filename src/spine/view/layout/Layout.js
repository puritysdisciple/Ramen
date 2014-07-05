JSoop.define('Spine.view.layout.Layout', {
    extend: 'Spine.view.Box',

    baseCls: 'layout',
    baseId: 'layout',

    wrapperTag: null,
    wrapperCls: '',

    constructor: function () {
        var me = this;

        me.callParent(arguments);

        me.initLayout();

        me.itemCache = JSoop.create('Spine.collection.Dictionary', null, {
            getKey: function (item) {
                return item.getId();
            },
            listeners: {
                add: me.onItemsAdd,
                remove: me.onItemsRemove,
                sort: me.onItemsSort,
                filter: me.onItemsFilter,
                scope: me
            }
        });

        me.mon(me.owner.items, {
            add: me.onOwnerItemsAdd,
            remove: me.onOwnerItemsRemove,
            sort: me.onOwnerItemsSort,
            scope: me
        });

        me.mon(me.owner, 'render:after', me.renderItems, me, {
            single: true
        });

        me.wrapperCache = {};
    },

    initLayout: JSoop.emptyFn,

    add: function (items) {
        var me = this;

        me.itemCache.add(items);
    },

    insert: function (items, index) {
        var me = this;

        me.itemCache.insert(items, index);
    },

    remove: function (items) {
        var me = this;

        me.itemCache.remove(items);
    },

    renderItems: function () {
        var me = this;

        if (!me.needsRender) {
            return;
        }

        me.itemCache.each(function (item, index) {
            var key = me.getItemId(item),
                wrapper = me.createWrapper(item, index);

            me.wrapperCache[key] = wrapper;

            item.render(wrapper);
        });
    },

    getItemId: function (item) {
        return this.itemCache.getKey(item);
    },

    createWrapper: function (item, index) {
        var me = this,
            tag = JSoop.clone(me.wrapperTag || {
                tag: 'div'
            }),
            classes = me.getWrapperClasses(item),
            container = me.owner.getTargetEl(),
            wrapper;

        JSoop.applyIf(tag, {
            cls: classes,
            style: me.getWrapperStyle()
        });

        wrapper = Spine.dom.Helper.create(tag);

        if (index === undefined || !container[0].childNodes[index]) {
            container.append(wrapper);
        } else {
            container = container[0];

            container.insertBefore(wrapper[0], container.childNodes[index]);
        }

        return wrapper;
    },

    getWrapperClasses: function () {
        var me = this;

        return [me.wrapperCls];
    },

    getWrapperStyle: function () {
        return {};
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

            item.render(wrapper);
        });
    },

    onItemsRemove: function (collection, removed) {
        var me = this;

        JSoop.each(removed, function (item) {
            var key = me.getItemId(item),
                wrapper = me.wrapperCache[key];

            delete me.wrapperCache[key];

            //todo: detach from jquery
            wrapper.remove();
        });
    },

    onItemsFilter: JSoop.emptyFn,

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
    },

    onOwnerItemsAdd: function (collection, items) {
        this.itemCache.add(items);
    },

    onOwnerItemsRemove: function (collection, items) {
        this.itemCache.remove(items);
    },

    onOwnerItemsSort: function () {
        var me = this;

        me.itemCache.sort(me.owner.items.sortFn);
    }
});
