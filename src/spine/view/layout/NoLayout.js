JSoop.define('Spine.view.layout.NoLayout', {
    extend: 'Spine.view.layout.Layout',

    renderItems: function () {
        var me = this;

        if (!me.needsRender) {
            return;
        }

        me.initContainer();

        me.itemCache.each(function (item, index) {
            var key = me.getItemId(item),
                wrapper = me.createWrapper(item, index);

            me.wrapperCache[key] = wrapper;

            item.render(me.owner.getTargetEl());
        });
    },

    createWrapper: function (item) {
        return item.el;
    },

    onItemsAdd: function (collection, added) {
        var me = this;

        if (!me.owner.isRendered) {
            me.needsRender = true;

            return;
        }

        JSoop.each(added, function (item) {
            var key = me.getItemId(item),
                index = me.itemCache.indexOf(item),
                wrapper = me.createWrapper(item, index);

            me.wrapperCache[key] = wrapper;

            item.render(me.owner.getTargetEl(), index);
        });
    }
});
