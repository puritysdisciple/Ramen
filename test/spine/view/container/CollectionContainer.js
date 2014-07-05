describe('Spine.view.container.CollectionContainer', function () {
    var collection, view;

    beforeEach(function () {
        collection = JSoop.create('Spine.data.Collection', [{
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

        view = JSoop.create('Spine.view.container.CollectionContainer', {
            collection: collection,
            layout: {
                wrapperCls: 'wrapper'
            },
            itemDefaults: {
                type: 'Spine.view.binding.BindingView',
                tpl: 'Hello {{ test }}!',
                bindings: {
                    test: {
                        formatter: function (model) {
                            return model.get('first') + ' ' + model.get('last');
                        }
                    }
                }
            },
            autoRender: true,
            renderTo: 'body'
        });
    });

    afterEach(function () {
        view.destroy();
    });

    it('should render items', function () {
        expect(view.el.find('.wrapper').length).toBe(2);
    });

    it('should render added items', function () {
        expect(view.el.find('.wrapper').length).toBe(2);

        collection.add({
            social: '333-33-3333',
            name: {
                first: 'Jarod',
                last: 'Overton'
            },
            age: '21'
        });

        expect(view.el.find('.wrapper').length).toBe(3);
    });

    it('should destroy removed items', function () {
        expect(view.el.find('.wrapper').length).toBe(2);

        collection.remove('222-22-2222');

        expect(view.el.find('.wrapper').length).toBe(1);
    });

    it('should properly sort items', function () {
        expect(view.el.find('.wrapper').eq(0).find('.binding').html()).toBe('Jarrod Nye');

        collection.sort('first');

        expect(view.el.find('.wrapper').eq(0).find('.binding').html()).toBe('Bertram Marlow');
    });

    it('should remove filtered items', function () {
        collection.addFilter('Jarod', {
            first: 'Jarrod',
            last: 'Nye'
        });

        expect(view.el.find('.wrapper').length).toBe(1);
    });
});
