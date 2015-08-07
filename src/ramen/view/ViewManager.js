/**
 * @class Ramen.view.ViewManager
 * @extends Ramen.collection.Dictionary
 */
JSoop.define('Ramen.view.ViewManager', {
    extend: 'Ramen.collection.Dictionary',

    singleton: true,

    getKey: function (item) {
        return item.getId();
    },

    find: function (query) {
        var me = this,
            query = Ramen.view.Query.parse(query),
            items = [];

        me.each(function (view) {
            if (query.is(view)) {
                items.push(view);
            }
        });

        return items;
    }
});
