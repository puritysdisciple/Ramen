describe('Ramen.app.History', function () {
    var currentFragment = '';

    Ramen.app.History.start();

    Ramen.app.History.on('change', function (fragment) {
        currentFragment = fragment;
    });

    it('should be able to correctly get the hash', function () {
        window.location.hash = '#test';

        expect(Ramen.app.History.getHash()).toBe('test');
    });

    it('should be able to correctly get the fragment', function () {
        window.location.hash = '#test2';

        expect(Ramen.app.History.getFragment()).toBe('test2');
    });

    it('should correctly trigger the change event', function () {
        runs(function () {
            window.location.hash = '#test3';
        });

        waitsFor(function () {
            return currentFragment === 'test3';
        }, 250);
    });

    it('should navigate silently', function () {
        currentFragment = '';

        Ramen.app.History.navigate({
            fragment: 'test4',
            silent: true
        });

        expect(currentFragment).toBe('');
        expect(window.location.hash).toBe('#test4');
    });

    it('should be able to fire events when navigating', function () {
        currentFragment = '';

        runs(function () {
            Ramen.app.History.navigate('test5');
        });

        waitsFor(function () {
            return currentFragment === 'test5' && window.location.hash === '#test5';
        }, 250);
    });
});
