/**
 * @class Ramen.view.binding.BindingView
 * A special view that allows the use of {@link #bindings}.
 * @extends Ramen.view.View
 */
JSoop.define('Ramen.view.binding.BindingView', {
    extend: 'Ramen.view.View',

    /**
     * @cfg {Ramen.view.binding.Binding[]/Object[]} bindings
     * An object containing binding configs that will be used to create {@link Ramen.view.binding.Binding}'s. If the
     * value is just a function, the view will assume that it is a formatter.
     *
     * Each binding will receive the following if they are not already set:
     *
     *  - **type** - {@link Ramen.view.binding.ModelBinding} will be used
     *  - **owner** - the current view
     *  - **token** - the key of the original object
     *
     * For example:
     *
     *      ...
     *      tpl: [
     *          '{{ name }}',
     *          '{{ address }}',
     *          '{{ total }}'
     *      ],
     *      bindings: {
     *          name: 'name',
     *          address: function (model) {
     *              return model.get('street') + ' ' +
     *                     model.get('city') + ', ' +
     *                     model.get('state') + ' ' +
     *                     model.get('zip');
     *          },
     *          total: {
     *              type: 'Demo.binding.Total'
     *          }
     *      },
     *      ...
     */
    /**
     * @cfg {Ramen.data.Model} model
     * The model that this view manages.
     */

    render: function () {
        var me = this;

        me.initBindings();

        me.callParent(arguments);
    },

    /**
     * @private
     */
    initBindings: function () {
        var me = this,
            bindings = JSoop.clone(me.bindings || {}),
            myModel = me.getModel();

        me.bindings = {};

        JSoop.iterate(bindings || {}, function (binding, key) {
            var model;

            if (JSoop.isString(binding)) {
                binding = {
                    field: binding
                };
            } else if (JSoop.isFunction(binding)) {
                binding = {
                    formatter: binding
                };
            }

            model = binding.model || myModel;

            if (JSoop.isString(model)) {
                model = JSoop.getValue(me[model], me);
            }

            if (!binding.isBinding) {
                JSoop.applyIf(binding, {
                    type: 'Ramen.view.binding.ModelBinding',
                    token: key,
                    owner: me
                });

                binding.model = model;

                binding = JSoop.create(binding.type, binding);
            } else {
                binding.owner = me;
                binding.model = model;

                binding.attach();
            }

            me.bindings[key] = binding;
        });
    },
    /**
     * Retrieves the managed model.
     * @returns {Ramen.data.Model}
     */
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
