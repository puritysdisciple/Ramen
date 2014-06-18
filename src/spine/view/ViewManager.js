JSoop.define('Spine.view.ViewManager', {
    extend: 'Spine.collection.Dictionary',

    singleton: true,

    getKey: function (item) {
        return item.getId();
    }
});
