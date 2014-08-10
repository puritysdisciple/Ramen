JSoop.define('Talk.model.User', {
    //...

    fields: [
        {name: 'id', mapping: 'user.id', type: 'int'},
        {name: 'name', mapping: 'user.name'},
        {name: 'message', mapping: 'user.message'}
    ]
});
