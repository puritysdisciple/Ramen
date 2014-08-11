describe('Ramen.collection.List', function () {
    var list;

    beforeEach(function () {
        list = JSoop.create('Ramen.collection.List');
    });

    it('should be able to correctly add items', function () {
        var item1 = {val: 1},
            item2 = {val: 2},
            item3 = {val: 3};

        list.add([item1, item2]);

        expect(list.items[0]).toBe(item1);
        expect(list.items[1]).toBe(item2);

        list.insert(item3, 1);

        expect(list.items[1]).toBe(item3);
    });

    it('should be able to correctly remove items', function () {
        var item1 = {val: 1},
            item2 = {val: 2},
            item3 = {val: 3};

        list.add([item1, item2, item3]);

        list.remove(item2);

        expect(list.items[1]).toBe(item3);

        list.insert(item2, 1);

        expect(list.items[1]).toBe(item2);

        list.removeAt(1);

        expect(list.items[1]).toBe(item3);
    });
});
