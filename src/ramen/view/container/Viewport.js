/**
 * @class Ramen.view.container.Viewport
 * A viewport is a special container that allows you to {@link #replace} all of its children with a new set of children.
 * @extends Ramen.view.container.Container
 */
JSoop.define('Ramen.view.container.Viewport', {
    extend: 'Ramen.view.container.Container',

    stype: 'viewport',
    baseId: 'viewport',
    baseCls: 'viewport',

    /**
     * @param {Ramen.view.Box/Object} items
     */
    replace: function (items) {
        var me = this;

        me.items.removeAll();

        me.add(items);
    }
});
