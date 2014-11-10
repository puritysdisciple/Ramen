JSoop.define('Talk.model.User', {
    //...

    associations: [{
        type: 'hasMany',
        model: 'Talk.model.User',
        name: 'Contacts',
        mapping: 'contacts',
        globalCollection: 'Users'
    }]
});
