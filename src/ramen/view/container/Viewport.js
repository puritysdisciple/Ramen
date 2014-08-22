/**
 * @class Ramen.view.container.Viewport
 * @extends Ramen.view.container.Container
 */
JSoop.define('Ramen.view.container.Viewport', {
    extend: 'Ramen.view.container.Container',

    stype: 'viewport',
    baseId: 'viewport',
    baseCls: 'viewport',

    replace: function (items) {
        var me = this;

        me.items.removeAll();

        me.add(items);
    }
});
