describe('Ramen.view.View', function () {
    var view;

    beforeEach(function () {
        view = JSoop.create('Ramen.view.View', {
            baseId: 'view',
            baseCls: 'view',
            tpl: [
                '<ul id="{{ id }}-list">',
                    '<li>item 1</li>',
                    '<li>item 2</li>',
                    '<li>item 3</li>',
                '</ul>'
            ],
            childEls: {
                listEl: 'list'
            },
            childSelectors: {
                listItems: 'li'
            },
            domListeners: {
                listEl: {
                    click: 'clickHandler'
                },
                listItems: {
                    click: 'clickHandlerOnce',
                    single: true
                }
            },
            autoRender: true,
            renderTo: 'body',

            listCount: 0,
            itemCount: 0,

            clickHandler: function (e) {
                var me = this;

                me.listCount = me.listCount + 1;

                e.stopImmediatePropagation();
            },

            clickHandlerOnce: function (e) {
                var me = this;

                me.itemCount = me.itemCount + 1;

                e.stopImmediatePropagation();
            }
        });
    });

    afterEach(function () {
        view.destroy();
    });

    it('should render the template correctly', function () {
        expect(view.el.find('li').length).toBe(3);
    });

    it('should find child els correctly', function () {
        expect(view.listItems.length).toBe(3);
    });

    it('should find render selectors correctly', function () {
        expect(view.listEl.length).toBe(1);
    });

    it('should correctly attach dom events', function () {
        expect(view.listCount).toBe(0);

        view.listEl.click();

        expect(view.listCount).toBe(1);

        expect(view.itemCount).toBe(0);

        view.listItems.eq(0).click();

        expect(view.itemCount).toBe(1);

        view.listItems.eq(1).click();

        expect(view.itemCount).toBe(1);
    });
});
