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
