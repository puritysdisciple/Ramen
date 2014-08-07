JSoop.define('Talk.view.Status', {
    //...

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

    onNameClick: function () {
        var me = this;

        //fire the 'select' event passing the view as a parameter
        me.fireEvent('select', me);
    }
});
