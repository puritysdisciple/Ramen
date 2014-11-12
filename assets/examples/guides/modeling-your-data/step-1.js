//define a new model
JSoop.define('Talk.model.User', {
    //extend the base model
    extend: 'Ramen.data.Model',

    //give the model a name
    name: 'User',

    //define some fields
    fields: [
        'id',
        'username',
        'message',
        'status'
    ]
});
