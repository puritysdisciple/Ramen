JSoop.define('Talk.view.Status', {
    //...

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
    }
});
