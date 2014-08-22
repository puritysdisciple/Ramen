/**
 * @class Ramen.util.Renderable
 */
JSoop.define('Ramen.util.Renderable', {
    isRenderable: true,

    createEl: function () {
        return Ramen.dom.Helper.create(this.getTagConfig());
    },

    getTagConfig: function () {
        var me = this,
            classes = JSoop.toArray(me.cls || []),
            tag;

        classes.push(me.baseCls);

        if (JSoop.isString(me.tag)) {
            tag = {
                tag: me.tag
            };
        } else {
            tag = JSoop.clone(me.tag || {});
        }

        JSoop.applyIf(tag, {
            tag: 'div',
            id: me.getId(),
            cls: classes,
            style: me.style || {}
        });

        return tag;
    },

    getTemplate: function (name) {
        var me = this,
            tpl = me[name];

        if (tpl.isTemplate) {
            return tpl;
        }

        me[name] = JSoop.create('Ramen.util.Template', tpl);

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
            me[key] = jQuery('#' + id + '-' + addition, me.el);
        });
    }
});
