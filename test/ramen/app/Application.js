describe('Ramen.app.Application', function () {
    var actions = 0;

    JSoop.define('Testing.app.Controller', {
        extend: 'Ramen.app.Controller',

        routes: {
            'user/:action': 'onUserAction'
        },

        actions: 0,

        onUserAction: function (action) {
            actions = actions + 1;
        }
    });

    JSoop.define('Testing.app.Companies', {
        extend: 'Ramen.data.Collection',

        model: 'Testing.data.Company'
    });

    Ramen.application({
        controllers: {
            user: 'Testing.app.Controller'
        },

        collections: {
            Companies: 'Testing.app.Companies'
        }
    });

    it('should correctly create create controllers', function () {
        runs(function () {
            window.location.hash = '#user/test';
        });

        waitsFor(function () {
            return actions === 1;
        }, 250);
    });

    it('should correctly create collections', function () {
        expect(Ramen.getCollection('Companies').isCollection).toBe(true);
    });
});
