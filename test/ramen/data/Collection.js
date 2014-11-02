describe('Ramen.data.Collection', function () {
    var collection;

    beforeEach(function () {
        collection = JSoop.create('Ramen.data.Collection', [{
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
            expect(collection.getCount()).toBe(2);

            collection.add({
                social: '111-11-1111',
                name: {
                    first: 'Ulysses',
                    last: 'Bryson'
                },
                age: '24'
            });

            expect(collection.getCount()).toBe(2);
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

            expect(collection.getCount()).toBe(3);
        });
    });

    it('should be able to correctly sort models', function () {
        expect(collection.at(0).get('first')).toBe('Jarrod');

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

        collection.clearSort();

        collection.add({
            social: '666-66-6666',
            name: {
                first: 'Maggie',
                last: 'Trace'
            },
            age: '41'
        });

        expect(collection.at(3).get('first')).toBe('Maggie');
    });

    it('should be able to filter models', function () {
        collection.addFilter('Bertram', {
            first: 'Bertram'
        });

        expect(collection.getCount()).toBe(1);

        collection.removeFilter('Bertram');

        expect(collection.getCount()).toBe(2);

        expect(collection.findFirst({
            first: 'Bertram'
        }).get('first')).toBe('Bertram');

        expect(collection.findLast({
            first: 'Jarrod'
        }).get('first')).toBe('Jarrod');

        expect(collection.find({
            first: 'Jarrod'
        }).length).toBe(1);

        collection.addFilter('Bertram', {
            first: 'Bertram'
        });

        collection.add({
            social: '666-66-6666',
            name: {
                first: 'Maggie',
                last: 'Trace'
            },
            age: '41'
        });

        expect(collection.getCount()).toBe(1);

        collection.clearFilters();

        expect(collection.getCount()).toBe(3);

        collection.filter();

        expect(collection.getCount()).toBe(3);
    });

    describe('should be able to remove models', function () {
        it('by model', function () {
            var id = collection.getKey(collection.at(1));

            expect(collection.getCount()).toBe(2);

            collection.remove(collection.at(1));

            expect(collection.indexOfKey(id)).toBe(-1);

            expect(collection.getCount()).toBe(1);
        });

        it('by key', function () {
            expect(collection.getCount()).toBe(2);

            collection.remove('222-22-2222');

            expect(collection.indexOfKey('222-22-2222')).toBe(-1);

            expect(collection.getCount()).toBe(1);
        });
    });

    it('should be able to be destroyed', function () {
        expect(collection.getCount()).toBe(2);

        collection.destroy();

        expect(collection.getCount()).toBe(0);
    });
});
