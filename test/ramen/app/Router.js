describe('Ramen.app.Router', function () {
    var calls = {
            'docs/:section': 0,
            'docs/:section/:subsection': 0,
            'faq/:section(/:subsection)': 0
        },
        router = JSoop.create('Ramen.app.Router', {
            routes: [
                'docs/:section',
                'docs/:section/:subsection',
                'faq/:section(/:subsection)'
            ],

            listeners: {
                route: function (router, path) {
                    calls[path] = calls[path] + 1;
                }
            }
        });

    beforeEach(function () {
        calls = {
            'docs/:section': 0,
            'docs/:section/:subsection': 0,
            'faq/:section(/:subsection)': 0
        };
    });

    it('should be able to correctly trigger routes', function () {
        runs(function () {
            window.location.hash = '#docs/test';
        });

        waitsFor(function () {
            return calls['docs/:section'] === 1 &&
                   calls['docs/:section/:subsection'] === 0 &&
                   calls['faq/:section(/:subsection)'] === 0;
        }, 250);

        runs(function () {
            window.location.hash = '#docs/test/test';
        });

        waitsFor(function () {
            return calls['docs/:section'] === 1 &&
                   calls['docs/:section/:subsection'] === 1 &&
                   calls['faq/:section(/:subsection)'] === 0;
        }, 250);

        runs(function () {
            window.location.hash = '#faq/test';
        });

        waitsFor(function () {
            return calls['docs/:section'] === 1 &&
                   calls['docs/:section/:subsection'] === 1 &&
                   calls['faq/:section(/:subsection)'] === 1;
        }, 250);

        runs(function () {
            window.location.hash = '#faq/test/test2';
        });

        waitsFor(function () {
            return calls['docs/:section'] === 1 &&
                   calls['docs/:section/:subsection'] === 1 &&
                   calls['faq/:section(/:subsection)'] === 2;
        }, 250);
    });
});
