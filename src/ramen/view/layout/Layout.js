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

        me.initContainer();

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
     * @returns {HTMLElement}
     */
    getWrapper: function (item) {
        var me = this,
            key = me.getItemId(item);

        return me.wrapperCache[key];
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
