JSoop.define('Talk.model.Conversation', {
    //...

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
