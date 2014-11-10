//define a new model
JSoop.define('Talk.model.User', {
    //extend the base model
    extend: 'Ramen.data.Model',

    //give the model a name
    name: 'User',

    //define some fields
    fields: [
        {name: 'id', mapping: 'user.id', type: 'int'},
        {name: 'name', mapping: 'user.name'},
        {name: 'message', mapping: 'user.message'}
    ],

    associations: [{
        type: 'hasMany',
        model: 'Talk.model.User',
        name: 'Contacts',
        mapping: 'contacts',
        globalCollection: 'Users'
    }]
});

JSoop.define('Talk.model.Conversation', {
    extend: 'Ramen.data.Model',

    name: 'Conversation',

    fields: [
        {name: 'id', type: 'int'}
    ],

    associations: [{
        //define the participants association
        type: 'hasMany',
        model: 'Talk.model.User',
        name: 'Participants',
        mapping: 'participants',
        //set the prepare function
        prepare: 'prepareParticipants'
    }, {
        //define the messages association
        type: 'hasMany',
        model: 'Talk.model.Message',
        name: 'Messages',
        mapping: 'messages'
    }],

    prepareParticipants: function (data) {
        var participants = [],
            //get the global users collection so we can query it
            users = Ramen.getCollection('Users');

        JSoop.each(data.participants, function (participantId) {
            //add the users to the participants array
            participants.push(users.get(participantId));
        });

        //assign the participants array back to the data so it can be used
        data.participants = participants;
    }
});

JSoop.define('Talk.model.Message', {
    extend: 'Ramen.data.Model',

    name: 'Message',

    fields: [
        {name: 'sender', type: 'int', convert: function (value) {
            //query the users collection for our sender
            return Ramen.getCollection('Users').get(value);
        }},
        'message'
    ]
});

