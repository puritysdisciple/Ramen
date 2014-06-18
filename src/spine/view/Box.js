JSoop.define('Spine.view.Box', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable',
        pluginManager: 'JSoop.mixins.PluginManager',
        renderable: 'Spine.util.Renderable'
    },

    stype: 'box',

    isBox: true,

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

        Spine.view.ViewManager.add(me);

        if (me.autoRender) {
            me.render(me.renderTo);
        }
    },

    initView: JSoop.emptyFn,

    getId: function () {
        var me = this;

        if (!me.id) {
            me.id = Spine.id(me.baseId);
        }

        return me.id;
    },

    render: function (container, index) {
        var me = this;

        if (me.fireEvent('render:before', me) === false) {
            return;
        }

        me.fireEvent('render:during', me);

        me.addToContainer(container, index);

        me.isRendered = true;

        me.fireEvent('render:after', me);
    },

    addToContainer: function (container, index) {
        var me = this;

        if (!container) {
            container = me.renderTo;
        }

        //<debug>
        if (!container) {
            jSoop.error('Render requires either a container argument or a "renderTo" config value');
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

        JSoop.each(classes, function (cls) {
            //todo: detach from jquery
            me.el.addClass(cls);
        });
    },

    removeCls: function (classes) {
        var me = this;

        classes = JSoop.toArray(classes);

        JSoop.each(classes, function (cls) {
            //todo: detach from jquery
            me.el.removeClass(cls);
        });
    },

    destroy: function () {
        var me = this;

        if (me.fireEvent('destroy:before') === false) {
            return;
        }

        me.fireEvent('destroy', me);

        me.removeAllListeners();
        me.removeAllManagedListeners();

        //todo: detach from jquery
        me.el.remove();
    }
});
