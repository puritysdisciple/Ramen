JSoop.define('Talk.model.Conversation', {
    extend: 'Spine.data.Model',

    name: 'Conversation',

    fields: [
        {name: 'id', type: 'int'}
    ]
});

JSoop.define('Talk.model.Message', {
    extend: 'Spine.data.Model',

    name: 'Message',

    fields: [
        {name: 'sender', type: 'int'},
        'message'
    ]
});
