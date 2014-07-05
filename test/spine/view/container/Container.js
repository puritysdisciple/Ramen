describe('Spine.view.container.Container', function () {
    it('should be able to render children', function () {
        var view = JSoop.create('Spine.view.container.Container', {
            items: [{
                tpl: 'Hello'
            }, {
                tpl: 'Hello Again'
            }],
            renderTo: 'body',
            autoRender: true
        });

        //console.log(view.el.html());
    });
});
