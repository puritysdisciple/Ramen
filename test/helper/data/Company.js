JSoop.define('Testing.data.Company', {
    extend: 'Spine.data.Model',

    name: 'Company',

    fields: [
        'name'
    ],

    idField: 'name',

    associations: [{
        type: 'hasMany',
        name: 'Employees',
        model: 'Testing.data.Person',
        mapping: 'employees',
        foreignKey: 'companyName'
    }]
});
