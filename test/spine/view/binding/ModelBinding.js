describe('Spine.view.binding.ModelBinding', function () {
    var binding, view, model;

    beforeEach(function () {
        model = JSoop.create('Testing.data.Person', {
            social: '111-11-1111',
            name: {
                first: 'Quibby',
                last: 'Higglesworth'
            },
            age: '29'
        });

        view = JSoop.create('Spine.view.View', {
            baseCls: 'test',
            baseId: 'test',
            tpl: [
                'hello, {{ test }}!'
            ]
        });

        binding = JSoop.create('Spine.view.binding.ModelBinding', {
            owner: view,
            token: 'test',
            model: model,
            formatter: function (model) {
                return model.get('first') + ' ' + model.get('last');
            }
        });

        view.render('body');
    });

    afterEach(function () {
        view.destroy();
        binding.destroy();
    });

    it('should correctly render the formatter', function () {
        expect(binding.el.html()).toBe('Quibby Higglesworth');
    });

    it('should correctly update when the model changes', function () {
        expect(binding.el.html()).toBe('Quibby Higglesworth');

        model.set('first', 'Magnus');

        expect(binding.el.html()).toBe('Magnus Higglesworth');

        model.set('last', 'Higglebottoms');

        expect(binding.el.html()).toBe('Magnus Higglebottoms');
    });
});
