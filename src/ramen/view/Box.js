/**
 * @class Ramen.view.Box
 * @mixins JSoop.mixins.Configurable
 * @mixins JSoop.mixins.Observable
 * @mixins JSoop.mixins.PluginManager
 * @mixins Ramen.util.Renderable
 */
JSoop.define('Ramen.view.Box', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable',
        pluginManager: 'JSoop.mixins.PluginManager',
        renderable: 'Ramen.util.Renderable'
    },

    stype: 'box',

    isBox: true,
    isManaged: true,

    autoRender: false,
    el: null,
    tag: null,

    config: {
        required: [
            'baseId',
            'baseCls'
        ]
    },

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');
        me.initMixin('pluginManager');

        me.initView();

        me.id = me.getId();
        me.el = me.createEl();

        if (me.isManaged) {
            Ramen.view.ViewManager.add(me);
        }

        if (me.autoRender) {
            me.render(me.renderTo);
        }
    },

    initView: JSoop.emptyFn,

    getId: function () {
        var me = this;

        if (!me.id) {
            me.id = Ramen.id(me.baseId);
        }

        return me.id;
    },

    render: function (container, index) {
        var me = this;

        if (me.fireEvent('render:before', me, container, index) === false) {
            return;
        }

        me.fireEvent('render:during', me);

        me.addToContainer(container, index);

        me.isRendered = true;

        if (me.owner) {
            me.fireEvent('render:after', me);
        } else {
            me.mon(me.owner, 'render:after', function () {
                me.fireEvent('render:after', me);
            }, me, {
                single: true
            });
        }
    },

    addToContainer: function (container, index) {
        var me = this;

        if (!container) {
            container = me.renderTo;
        }

        //<debug>
        if (!container) {
            JSoop.error('Render requires either a container argument or a "renderTo" config value');
        }
        //</debug>

        //todo: detach from jquery
        container = jQuery(container).eq(0);

        if (index === undefined || !container[0].childNodes[index]) {
            container.append(me.el);
        } else {
            container = container[0];

            container.insertBefore(me.el[0], container.childNodes[index]);
        }
    },

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

    destroy: function () {
        var me = this;

        if (me.fireEvent('destroy:before') === false) {
            return false;
        }

        me.fireEvent('destroy', me);

        me.removeAllListeners();
        me.removeAllManagedListeners();
        me.destroyPlugins();

        //todo: detach from jquery
        me.el.remove();

        if (me.isManaged) {
            Ramen.view.ViewManager.remove(me);
        }
    },

    onDestroyBefore: JSoop.emptyFn,
    onDestroy: JSoop.emptyFn,

    onRenderDuring: JSoop.emptyFn,
    onRenderBefore: JSoop.emptyFn,
    onRenderAfter: JSoop.emptyFn
});
