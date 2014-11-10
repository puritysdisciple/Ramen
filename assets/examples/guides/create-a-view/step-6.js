//define our new view type like any other class
JSoop.define('Talk.view.Status', {
    //extend the base view type
    extend: 'Ramen.view.binding.BindingView',

    //configure the view as we need it
    rtype: 'talk-status',

    baseId: 'talk-status',
    baseCls: 'talk-status',

    //the tpl can be either a string or an array of strings for readability
    tpl: [
        '<div class="{{ baseCls }}-status">{{ status }}</div>',
        '<div id="{{ id }}-name" class="{{ baseCls }}-name">{{ name }}</div>',
        '<div class="{{ baseCls }}-message">{{ message }}</div>'
    ],

    childEls: {
        //grab a reference to {{ id }}-name and store it as nameEl
        nameEl: 'name'
    },

    domListeners: {
        //set listeners on nameEl
        nameEl: {
            //set the view's onNameClick method as a listener for the 'click' event
            click: 'onNameClick'
        }
    },

    bindings: {
        //the status binding needs to format model data, so we give it a formatting function
        status: function (model) {
            return '<span class="status-' + model.get('status') + '"></span>';
        },
        //the message just needs to be the value of the 'message' field
        //so we just set it to the field name
        message: 'message'
    },

    //use the 'initView' hook to set our renderData
    initView: function () {
        var me = this;

        //create the renderData object
        me.renderData = {
            //add the name field from our model
            name: me.model.get('name')
        };

        //always make sure to use 'callParent' on any hooks
        me.callParent(arguments);
    },

    onNameClick: function () {
        var me = this;

        //fire the 'select' event passing the view as a parameter
        me.fireEvent('select', me);
    }
});