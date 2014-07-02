describe('Spine.view.binding.Binding', function () {
    var binding, view;

    beforeEach(function () {
        view = JSoop.create('Spine.view.View', {
            baseCls: 'test',
            baseId: 'test',
            tpl: [
                '{{ test }}'
            ]
        });

        binding = JSoop.create('Spine.view.binding.Binding', {
            owner: view,
            token: 'test',
            html: 'hey you!',
            update: function () {
                var me = this;

                me.el.html(me.html);
            }
        });

        view.render('body');
    });

    it('should correctly create an element', function () {
        expect(binding.el[0].nodeName).toBe('DIV');
    });

    it('should correctly update after rendering', function () {
        expect(binding.el.html()).toBe('hey you!');
    });

    it('should correctly update', function () {
        binding.html = 'omg hi!';
        binding.update();

        expect(binding.el.html()).toBe('omg hi!');
    });
});
