JSoop.define('Spine.view.View', {
    extends: 'Spine.view.Box',

    tpl: '',

    initRenderData: function (renderData) {
        var me = this;

        JSoop.applyIf(renderData, {
            id: me.getId(),
            baseCls: me.baseCls
        });

        return renderData;
    },

    onRenderDuring: function () {
        var me = this,
            renderData = me.initRenderData(me.renderData || {}),
            tpl = me.getTpl('tpl');

        //todo: detach from jquery
        me.el.html(tpl.render(renderData));

        me.initRenderSelectors();
        me.initChildEls()
    },

    getTpl: function (name) {
        var me = this,
            tpl = me[name];

        if (tpl.isTemplate) {
            return tpl;
        }

        me[name] = JSoop.create('Spine.util.Template', tpl);

        return me[name];
    },

    initRenderSelectors: function () {
        var me = this,
            renderSelectors = me.renderSelectors || {};

        JSoop.iterate(renderSelectors, function (selector, key) {
            //todo: detach from jquery
            me[key] = jQuery(selector, me.el);
        });
    },

    initChildEls: function () {
        var me = this,
            id = me.getId(),
            els = me.childEls || {};

        JSoop.iterate(els, function (addition, key) {
            //todo: detach from jquery
            me[key] = jQuery('#' + id + '-' + addition);
        });
    }
});
