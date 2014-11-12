JSoop.define('Talk.model.User', {
    //extend the base model
    extend: 'Ramen.data.Model',

    //give the model a name
    name: 'User',

    //define some fields
    fields: [
        {name: 'id', mapping: 'user.id', type: 'int'},
        {name: 'name', mapping: 'user.name'},
        {name: 'message', mapping: 'user.message'},
        {name: 'status', mapping: 'user.status'}
    ],

    associations: [{
        type: 'hasMany',
        model: 'Talk.model.User',
        name: 'Contacts',
        mapping: 'contacts',
        globalCollection: 'Users'
    }]
});
