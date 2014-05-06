describe('Spine.data.Model', function () {
    var model = JSoop.create('Testing.data.Company', {
        name: 'Test Company',
        employees: [{
            social: '111-11-1111',
            name: {
                first: 'Jarrod',
                last: 'Nye'
            },
            age: '23'
        }, {
            social: '222-22-2222',
            name: {
                first: 'Bertram',
                last: 'Marlow'
            },
            age: '28'
        }]
    });

    it('should correctly parse fields', function () {
        expect(model.get('name')).toBe('Test Company');
    });

    it('should correctly parse associations', function () {
        expect(model.getEmployees().getCount()).toBe(2);
    });
});
