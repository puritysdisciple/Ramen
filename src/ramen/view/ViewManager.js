/**
 * @class Ramen.view.ViewManager
 * @extends Ramen.collection.Dictionary
 */
JSoop.define('Ramen.view.ViewManager', {
    extend: 'Ramen.collection.Dictionary',

    singleton: true,

    getKey: function (item) {
        return item.getId();
    }
});
