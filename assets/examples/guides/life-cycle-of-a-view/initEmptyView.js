JSoop.define('Spine.view.container.CollectionContainer', {
    //...
    initEmptyView: function () {
        var me = this,
            emptyView;

        if (!me.emptyView) {
            return;
        }

        if (!me.emptyView.isBox) {
            emptyView = JSoop.clone(me.emptyView);

            //empty view doesn't have a model, so we need to bypass CollectionContainer::initItem
            emptyView = Spine.view.container.Container.prototype.initItem.call(me, emptyView);

            me.emptyView = emptyView;
        }

        //hide the empty view by default
        me.emptyView.on('render:during', me.hideEmptyView, me, {single: true});

        //add the item directly
        me.items.add(emptyView);
    },
    //...
});
