JSoop.addPath('YourApp', '/app/'); //setup JSoop's loader

Ramen.application({
    requires: [
        'YourApp.HelloWorld'
    ],

    run: function () {
        JSoop.create('YourApp.HelloWorld', {
            renderTo: 'body',
            autoRender: true
        });
    }
});