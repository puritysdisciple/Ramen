/**
 * @class Ramen.view.container.Container
 * @extends Ramen.view.View
 */
JSoop.define('Ramen.view.container.Container', {
    extend: 'Ramen.view.View',

    isContainer: true,

    stype: 'container',

    baseCls: 'container',
    baseId: 'container',

    layout: 'Ramen.view.layout.Layout',

    initView: function () {
        var me = this,
            items = JSoop.clone(me.items);

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
    },

    initItems: function (items) {
        var me = this;

        items = JSoop.toArray(items);

        JSoop.each(items, function (item, index) {
            item = me.initItem(item);

            items[index] = item;
        });

        return items;
    },

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

    getTargetEl: function () {
        return this.el;
    },

    add: function (items) {
        var me = this;

        items = me.initItems(items);

        me.items.add(items);
    },

    remove: function (items) {
        this.items.remove(items);
    },

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

    findFirst: function (query) {
        var me = this;

        return me.find(query).shift();
    },

    findLast: function (query) {
        var me = this;

        return me.find(query).pop();
    }
});
