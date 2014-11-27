Ramen.application({
    run: function () {
        JSoop.create('Ramen.view.View', {
            tpl: 'Hello World!',
            renderTo: 'body',
            autoRender: true
        });
    }
});