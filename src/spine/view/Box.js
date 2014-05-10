JSoop.define('Spine.view.Box', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable',
        pluginManager: 'JSoop.mixins.PluginManager'
    },

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

        me.id = me.getId();
        me.el = me.createEl();

        me.initView();

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

    createEl: function () {
        var me = this,
            tag = me.tag || {
                tag: 'div',
                cls: JSoop.toArray(me.cls).push(me.baseCls),
                style: me.style || {}
            };

        return Spine.dom.Helper.create(tag);
    },

    render: function (container) {
        var me = this;

        if (!container) {
            container = me.renderTo;
        }

        //<debug>
        if (!container) {
            jSoop.error('Render requires either a container argument or a "renderTo" config value');
        }
        //</debug>

        if (me.fireEvent('render:before', me) === false) {
            return;
        }

        me.fireEvent('render:during', me);

        //todo: detach from jquery
        jQuery(container).append(me.el);

        me.fireEvent('render:after', me);
    }
});
