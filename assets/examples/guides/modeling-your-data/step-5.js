//get the contacts collection
user.getContacts()
    //iterate through it
    .each(function (contact) {
        //log the name of each contact
        console.log(contact.get('name'));
    });
