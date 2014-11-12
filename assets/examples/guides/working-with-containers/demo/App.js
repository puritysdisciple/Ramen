Ramen.application({
    collections: {
        Users: 'Talk.collection.Users'
    },

    run: function () {
        var me = this;

        Ramen.getCollection('Users').add({
            "user": {
                "id": "1",
                "name": "Eric",
                "status": "busy",
                "message": "God help you if you message me"
            },
            "contacts": [{
                "id": "2",
                "name": "Aiden",
                "status": "away",
                "message": "If only I had pie..."
            }, {
                "id": "3",
                "name": "Layla",
                "status": "available",
                "message": "Coding up a storm!"
            }]
        });

        JSoop.create('Talk.view.ControlPanel', {
            renderTo: '#demo',
            model: Ramen.getCollection('Users').at(0),
            autoRender: true
        });
    }
});
