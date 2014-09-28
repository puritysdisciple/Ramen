/**
 * @class Ramen.util.Renderable
 * @private
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

    /**
     * Retrieves a template from the class. If the property with the given name is not a template, a template will be
     * created using the value of the property.
     * @param {String} name The name of the desired template
     * @returns {Ramen.util.Template}
     */
    getTemplate: function (name) {
        var me = this,
            tpl = me[name];

        if (tpl.isTemplate) {
            return tpl;
        }

        me[name] = JSoop.create('Ramen.util.Template', tpl);

        return me[name];
    },

    initChildSelectors: function () {
        var me = this,
            renderSelectors = me.renderSelectors || {},
            childSelectors = me.childSelectors || {}
            //<debug>
            ,hasRenderSelectors = false
            //</debug>
            ;

        JSoop.iterate(renderSelectors, function (selector, key) {
            //<debug>
            hasRenderSelectors = true;
            //</debug>
            //todo: detach from jquery
            me[key] = jQuery(selector, me.el);
        });

        //<debug>
        if (hasRenderSelectors) {
            JSoop.log('renderSelectors being used in ' + me.$className + '. renderSelectors is depreciated, please use childSelectors instead');
        }
        //</debug>

        JSoop.iterate(childSelectors, function (selector, key) {
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
    },

    /**
     * Adds a css class to the element.
     * @param {String/String[]} classes The classes to add
     */
    addCls: function (classes) {
        var me = this;

        classes = JSoop.toArray(classes);

        if (!me.el) {
            if (!me.cls) {
                me.cls = [];
            }

            JSoop.each(classes, function (cls) {
                if (JSoop.util.Array.indexOf(me.cls, cls) === -1) {
                    me.cls.push(cls);
                }
            });

            return;
        }

        JSoop.each(classes, function (cls) {
            //todo: detach from jquery
            me.el.addClass(cls);
        });
    },
    /**
     * Removes a css class from the element.
     * @param {String/String[]} classes The classes to remove
     */
    removeCls: function (classes) {
        var me = this;

        classes = JSoop.toArray(classes);

        if (!me.el) {
            if (!me.cls) {
                return;
            }

            JSoop.each(classes, function (cls) {
                index = JSoop.util.Array.indexOf(me.cls, cls);

                if (index !== -1) {
                    me.cls.splice(index, 1);
                }
            });

            return;
        }

        JSoop.each(classes, function (cls) {
            //todo: detach from jquery
            me.el.removeClass(cls);
        });
    },
});
