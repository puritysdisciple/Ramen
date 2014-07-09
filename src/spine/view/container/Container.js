JSoop.define('Spine.view.container.Container', {
    extend: 'Spine.view.View',

    isContainer: true,

    baseCls: 'container',
    baseId: 'container',

    layout: 'Spine.view.layout.Layout',

    initView: function () {
        var me = this,
            items = JSoop.clone(me.items);

        me.callParent(arguments);

        me.items = JSoop.create('Spine.collection.Dictionary', null, {
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
            type: 'Spine.view.layout.Layout'
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

        JSoop.applyIf(item, JSoop.clone(me.itemDefaults || {}));
        JSoop.applyIf(item, {
            type: 'Spine.view.View'
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

    destroy: function () {
        var me = this;

        if (me.callParent(arguments) !== false) {
            me.items.each(function (item) {
                item.destroy();
            });

            me.items.removeAll();

            me.layout.destroy();
        }
    }
});
