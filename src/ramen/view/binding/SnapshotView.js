JSoop.define('Ramen.view.binding.SnapshotView', {
    extend: 'Ramen.view.binding.BindingView',

    initBindings: function () {
        var me = this,
            model = me.getModel();

        me.callParent(arguments);

        JSoop.iterate(me.bindings || {}, function (binding) {
            binding.mun(model, binding.onChange, binding);
        });
    }
});
