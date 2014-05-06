JSoop.define('Testing.data.Person', {
    extend: 'Spine.data.Model',

    name: 'Person',

    idField: 'social',

    fields: [
        'social',
        {name: 'first', mapping: 'name.first'},
        {name: 'last', mapping: 'name.last'},
        {name: 'age', type: 'int'}
    ]
});
