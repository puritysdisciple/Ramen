//define a new model
JSoop.define('Talk.model.User', {
    //extend the base model
    extend: 'Spine.data.Model',

    //give the model a name
    name: 'User',

    //define some fields
    fields: [
        'id',
        'username',
        'message'
    ]
});
