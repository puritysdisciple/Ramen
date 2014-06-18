describe('Spine.data.Collection', function () {
    var collection = JSoop.create('Spine.data.Collection', [{
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
    }], {
        model: 'Testing.data.Person'
    });

    describe('should be able to add', function () {
        it('basic objects', function () {
            expect(collection.getCount()).toBe(2);

            collection.add({
                social: '333-33-3333',
                name: {
                    first: 'Jarod',
                    last: 'Overton'
                },
                age: '21'
            });

            expect(collection.getCount()).toBe(3);
        });

        it('duplicate keys', function () {
            expect(collection.getCount()).toBe(3);

            collection.add({
                social: '111-11-1111',
                name: {
                    first: 'Ulysses',
                    last: 'Bryson'
                },
                age: '24'
            });

            expect(collection.getCount()).toBe(3);
            expect(collection.at(0).get('first')).toBe('Ulysses');
        });

        it('models', function () {
            var model = JSoop.create('Testing.data.Person', {
                social: '444-44-4444',
                name: {
                    first: 'Dashiell',
                    last: 'Day'
                },
                age: '20'
            });

            collection.add(model);

            expect(collection.getCount()).toBe(4);
        });
    });

    it('should be able to correctly sort models', function () {
        expect(collection.at(0).get('first')).toBe('Ulysses');

        collection.sort('first');

        expect(collection.at(0).get('first')).toBe('Bertram');

        collection.add({
            social: '555-55-5555',
            name: {
                first: 'Clark',
                last: 'Forrest'
            },
            age: '30'
        });

        expect(collection.at(1).get('first')).toBe('Clark');
    });

    it('should be able to filter models', function () {
        collection.addFilter('Clark', {
            first: 'Clark'
        });

        expect(collection.getCount()).toBe(1);

        collection.removeFilter('Clark');

        expect(collection.getCount()).toBe(5);

        expect(collection.first({
            first: 'Dashiell'
        }).get('first')).toBe('Dashiell');

        expect(collection.last({
            first: 'Jarod'
        }).get('first')).toBe('Jarod');

        expect(collection.find({
            first: 'Jarod'
        }).length).toBe(1);
    });

    describe('should be able to remove models', function () {
        it('by model', function () {
            expect(collection.getCount()).toBe(5);

            collection.remove(collection.at(1));

            expect(collection.getCount()).toBe(4);
        });

        it('by key', function () {
            expect(collection.getCount()).toBe(4);

            collection.remove('444-44-4444');

            expect(collection.getCount()).toBe(3);
        });
    });
});
