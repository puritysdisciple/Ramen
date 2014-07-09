describe('Spine.app.Application', function () {
    var actions = 0;

    JSoop.define('Testing.app.Controller', {
        extend: 'Spine.app.Controller',

        routes: {
            'user/:action': 'onUserAction'
        },

        actions: 0,

        onUserAction: function (action) {
            actions = actions + 1;
        }
    });

    JSoop.define('Testing.app.Companies', {
        extend: 'Spine.data.Collection',

        model: 'Testing.data.Company'
    });

    Spine.application({
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
        expect(Spine.getCollection('Companies').isCollection).toBe(true);
    });
});
