JSoop.define('Talk.view.ContactList', {
    extend: 'Ramen.view.container.CollectionContainer',

    rtype: 'contact-list',
    baseId: 'contact-list',
    baseCls: 'contact-list',

    itemDefaults: {
        type: 'Talk.view.Status'
    }
});
