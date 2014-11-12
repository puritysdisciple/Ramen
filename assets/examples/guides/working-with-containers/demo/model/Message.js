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
