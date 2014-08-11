JSoop.define('Ramen.view.layout.Layout', {
    extend: 'Ramen.view.Box',

    isLayout: true,

    isManaged: false,

    baseCls: 'layout',
    baseId: 'layout',

    wrapperTag: null,
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
    initContainer: JSoop.emptyFn,

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

        me.initContainer();

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

    getWrapperClasses: function (item) {
        var me = this,
            classes = [me.wrapperCls];

        if (item.wrapperCls) {
            classes = classes.concat(JSoop.toArray(item.wrapperCls));
        }

        return classes;
    },

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

    destroy: function () {
        var me = this;

        if (me.callParent(arguments) !== false) {
            me.itemCache.removeAll();
        }
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
            item.destroy();
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
        var me = this;

        JSoop.each(items, function (item) {
            var index = collection.indexOf(item);

            me.itemCache.insert(item, index);
        });
    },

    onOwnerItemsRemove: function (collection, items) {
        this.itemCache.remove(items);
    },

    onOwnerItemsSort: function () {
        var me = this;

        me.itemCache.sort(me.owner.items.sortFn);
    }
});
