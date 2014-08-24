/**
 * @class Ramen.view.binding.Binding
 * @mixins JSoop.mixins.Configurable
 * @mixins JSoop.mixins.Observable
 * @mixins Ramen.util.Renderable
 */
JSoop.define('Ramen.view.binding.Binding', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable',
        renderable: 'Ramen.util.Renderable'
    },

    isBinding: true,

    baseCls: 'binding',
    tpl: '{{ content }}',

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');

        me.initBinding();

        if (me.owner) {
            me.attach();
        }
    },

    attach: function () {
        var me = this;

        me.owner.on({
            'render:before': me.onOwnerRenderBefore,
            'render:during': me.onOwnerRenderDuring,
            scope: me,
            single: true
        });
    },

    initBinding: JSoop.emptyFn,

    getId: function () {
        var me = this;

        if (!me.id) {
            me.id = Ramen.id('binding');
        }

        return me.id;
    },

    getHtml: function () {
        var me = this,
            tag = me.getTagConfig();

        tag.html = me.getContent();

        return Ramen.dom.Helper.markup(tag);
    },

    getContent: function () {
        var me = this,
            renderData = me.getRenderData();

        if (!JSoop.isObject(renderData)) {
            renderData = {
                content: renderData
            };
        }

        JSoop.applyIf(renderData, {
            id: me.getId(),
            baseCls: me.baseCls
        });

        return me.getTemplate('tpl').render(renderData);
    },

    getRenderData: function () {
        return '';
    },

    update: function () {
        var me = this;

        setTimeout(function () {
            me.el.html(me.getContent());
        }, 0);
    },

    destroy: function () {
        var me = this;

        me.removeAllListeners();
        me.removeAllManagedListeners();
    },

    onOwnerRenderBefore: function (view) {
        var me = this;

        view.renderData[me.token] = me.getHtml();
    },

    onOwnerRenderDuring: function () {
        var me = this;

        //todo: detach from jquery
        me.el = me.owner.el.find('#' + me.getId());

        me.initChildSelectors();
        me.initChildEls();

        me.update();
    }
});
