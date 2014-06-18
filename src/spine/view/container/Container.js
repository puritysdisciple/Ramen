JSoop.define('Spine.view.container.Container', {
    extend: 'Spine.view.View',

    config: {
        defaults: {
            layout: 'auto',
            targetEl: 'el',
            itemDefaults: {}
        }
    },

    onRenderDuring: function () {
        var me = this,
            items = JSoop.toArray(me.items || []);

        me.callParent(arguments);

        me.items = JSoop.create('Spine.collection.Dictionary', {
            getKey: function (item) {
                return item.getId();
            }
        });

        me.initLayout();

        JSoop.each(items, function (item) {
            me.add(item);
        });
    },

    initItem: function (item) {
        var me = this,
            type;

        if (!item.isBox) {
            if (JSoop.isString(item)) {
                item = {
                    type: item
                };
            }

            JSoop.applyIf(item, me.itemDefaults);

            if (item.type) {
                type = item.type;
            } else if (item.vtype) {
                type = 'view.' + item.vtype;
            } else {
                type = 'Spine.view.View';
            }

            item = JSoop.create(type, item);
        }

        return item;
    },

    initLayout: function () {
        var me = this;

        if (me.layout.isLayout) {
            return;
        }

        me.layout = JSoop.create('layout.' + me.layout, {
            owner: me
        });
    },

    insert: function (item, index) {
        var me = this;

        item = me.initItem(item);
        me.items.insert(item, index);

        return item;
    },

    add: function (item) {
        var me = this;

        return me.insert(item, me.items.getCount());
    },

    remove: function (item) {
        var me = this;

        //todo: this seems awkward, why do we call get, then remove?
        if (JSoop.isString(item)) {
            item = me.items.get(item);
        }

        me.items.remove(item);
    }
});

/*
container
    - items

container render
    - init items
    - add to dictionary

dictionary add
    - item has container
        - remove from container
    - layout render

dictionary remove
    - layout remove wrapper

item destroy
    - remove from dictionary


*/
