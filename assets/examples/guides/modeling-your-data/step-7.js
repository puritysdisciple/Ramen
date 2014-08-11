JSoop.define('Talk.model.Message', {
    //...

    fields: [
        {name: 'sender', type: 'int', convert: function (value) {
            //query the users collection for our sender
            return Ramen.getCollection('Users').get(value);
        }},
        //...
    ]
});
