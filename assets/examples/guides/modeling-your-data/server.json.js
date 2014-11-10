//this is the response we get when requesting user data
{
    "user": {
        "id": "1",
        "name": "Eric",
        "status": "busy",
        "message": "God help you if you message me"
    },
    "contacts": [{
        "id": "2",
        "name": "Aiden",
        "status": "available",
        "message": "If only I had pie..."
    }, {
        "id": "3",
        "name": "Layla",
        "status": "available",
        "message": "Coding up a storm!"
    }]
}

//this is the response we get when requesting a conversation
{
    "id": "27",
    "participants": [1, 3],
    "messages": [{
        "sender": 1,
        "message": "Hey, you want to grab some lunch?"
    }, {
        "sender": 1,
        "message": "I was thinking of hitting up the Irish pub"
    }, {
        "sender": 3,
        "message": "Sure! Let me finish up this code real quick"
    }]
}
