describe('Spine.app.History', function () {
    var currentFragment = '';

    Spine.app.History.start();

    Spine.app.History.on('change', function (fragment) {
        currentFragment = fragment;
    });

    it('should be able to correctly get the hash', function () {
        window.location.hash = '#test';

        expect(Spine.app.History.getHash()).toBe('test');
    });

    it('should be able to correctly get the fragment', function () {
        window.location.hash = '#test2';

        expect(Spine.app.History.getFragment()).toBe('test2');
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

        Spine.app.History.navigate({
            fragment: 'test4',
            silent: true
        });

        expect(currentFragment).toBe('');
        expect(window.location.hash).toBe('#test4');
    });

    it('should be able to fire events when navigating', function () {
        currentFragment = '';

        runs(function () {
            Spine.app.History.navigate('test5');
        });

        waitsFor(function () {
            return currentFragment === 'test5' && window.location.hash === '#test5';
        }, 250);
    });
});
