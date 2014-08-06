describe('Spine.view.Box', function () {
    var view;

    beforeEach(function () {
        view = JSoop.create('Spine.view.Box', {
            baseId: 'testing',
            baseCls: 'testing',
            cls: [
                'additional',
                'even-more'
            ],
            autoRender: true,
            renderTo: 'body'
        });
    });

    afterEach(function () {
        view.destroy();
    });

    it('should register itself with the ViewManager', function () {
        expect(Spine.view.ViewManager.indexOf(view)).not.toBe(-1);
    });

    it('should render correctly', function () {
        expect(view.el[0].parentNode).toBe(document.body);
    });

    it('should generate the id using the baseId', function () {
        expect(view.el[0].id.indexOf('testing-')).not.toBe(-1);
    });

    it('should correctly add classes', function () {
        expect(view.el[0].className.indexOf('testing')).not.toBe(-1);
        expect(view.el[0].className.indexOf('additional')).not.toBe(-1);
        expect(view.el[0].className.indexOf('even-more')).not.toBe(-1);

        view.addCls('added');

        expect(view.el[0].className.indexOf('added')).not.toBe(-1);

        view.addCls([
            'array-1',
            'array-2'
        ]);

        expect(view.el[0].className.indexOf('array-1')).not.toBe(-1);
        expect(view.el[0].className.indexOf('array-2')).not.toBe(-1);
    });

    it('should correctly remove classes', function () {
        expect(view.el[0].className.indexOf('additional')).not.toBe(-1);

        view.removeCls('additional');

        expect(view.el[0].className.indexOf('additional')).toBe(-1);

        view.addCls('added');

        view.removeCls([
            'even-more',
            'added'
        ]);

        expect(view.el[0].className.indexOf('even-more')).toBe(-1);
        expect(view.el[0].className.indexOf('added')).toBe(-1);
    });

    it('should correctly destroy itself', function () {
        view.destroy();

        expect(Spine.view.ViewManager.indexOf(view)).toBe(-1);

        if (view.el[0].parentNode) {
            //this is for testing IE8 or lower
            expect(view.el[0].parentNode.nodeType).toBe(11);
        } else {
            expect(view.el[0].parentNode).toBeFalsy();
        }
    });
});
