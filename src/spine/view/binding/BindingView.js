JSoop.define('Spine.view.binding.BindingView', {
    extend: 'Spine.view.View',

    render: function () {
        var me = this;

        me.initBindings();

        me.callParent(arguments);
    },

    initBindings: function () {
        var me = this,
            bindings = JSoop.clone(me.bindings || {}),
            model = me.getModel();

        me.bindings = {};

        JSoop.iterate(bindings || {}, function (binding, key) {
            if (JSoop.isString(binding)) {
                binding = {
                    field: binding
                };
            }

            if (!binding.isBinding) {
                JSoop.applyIf(binding, {
                    type: 'Spine.view.binding.ModelBinding',
                    token: key,
                    owner: me,
                    model: model
                });

                binding = JSoop.create(binding.type, binding);
            } else {
                binding.owner = me;
                binding.model = model;

                binding.attach();
            }

            me.bindings[key] = binding;
        });
    },

    getModel: function () {
        return this.model;
    },

    onDestroy: function () {
        var me = this;

        JSoop.iterate(me.bindings, function (binding) {
            binding.destroy();
        });

        me.callParent(arguments);
    }
});
