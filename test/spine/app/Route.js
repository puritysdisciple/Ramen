describe('Spine.app.Route', function () {
    var route = JSoop.create('Spine.app.Route', {
        route: 'docs/:section(/:subsection)'
    });

    it('should correctly test hashes', function () {
        expect(route.is('docs/test')).toBe(true);
        expect(route.is('docs/test/test')).toBe(true);
        expect(route.is('faq/test')).toBe(false);
        expect(route.is('docs/test/test/test')).toBe(false);
    });

    it('should be able to pull parameters out of a hash', function () {
        var params = route.getParams('docs/test/test2');

        expect(params[0]).toBe('test');
        expect(params[1]).toBe('test2');

        params = route.getParams('docs/test');

        expect(params[0]).toBe('test');
        expect(params[1]).toBe(null);
    });
});
