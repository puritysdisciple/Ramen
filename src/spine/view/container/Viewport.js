JSoop.define('Spine.view.container.Viewport', {
    extend: 'Spine.view.container.Container',

    stype: 'viewport',
    baseId: 'viewport',
    baseCls: 'viewport',

    replace: function (items) {
        var me = this;

        me.items.removeAll();

        me.add(items);
    }
});
