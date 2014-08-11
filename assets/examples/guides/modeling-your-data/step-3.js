JSoop.define('Talk.model.Conversation', {
    extend: 'Ramen.data.Model',

    name: 'Conversation',

    fields: [
        {name: 'id', type: 'int'}
    ]
});

JSoop.define('Talk.model.Message', {
    extend: 'Ramen.data.Model',

    name: 'Message',

    fields: [
        {name: 'sender', type: 'int'},
        'message'
    ]
});
