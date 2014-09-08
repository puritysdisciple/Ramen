/**
 * @class Ramen.view.binding.Binding
 * Represents a living piece of data within a view. It will update it's display when something changes. The most common
 * form of binding is {@link Ramen.view.binding.ModelBinding}.
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

    /**
     * The base class applied to the containing element and passed to the template
     */
    baseCls: 'binding',

    /**
     * The template used to render content
     */
    tpl: '{{ content }}',

    /**
     * @param {Object} config
     */
    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');

        me.initBinding();

        if (me.owner) {
            me.attach();
        }
    },

    /**
     * @private
     */
    attach: function () {
        var me = this;

        me.mon(owner, {
            'render:before': me.onOwnerRenderBefore,
            'render:during': me.onOwnerRenderDuring,
            scope: me,
            single: true
        });
    },

    /**
     * @method
     * @template
     */
    initBinding: JSoop.emptyFn,

    /**
     * @returns {String}
     */
    getId: function () {
        var me = this;

        if (!me.id) {
            me.id = Ramen.id('binding');
        }

        return me.id;
    },

    /**
     * Retrieves the complete markup for the binding that needs to be inserted into a view. The includes the wrapping
     * element as well as the rendered template.
     * @returns {String}
     */
    getHtml: function () {
        var me = this,
            tag = me.getTagConfig();

        tag.html = me.getContent();

        return Ramen.dom.Helper.markup(tag);
    },

    /**
     * Retrieves the content of the binding.
     * @returns {String}
     */
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

    /**
     * @private
     * @returns {String}
     */
    getRenderData: function () {
        return '';
    },

    /**
     * This needs to be called whenever the binding needs to update its content.
     */
    update: function () {
        var me = this;

        setTimeout(function () {
            me.el.html(me.getContent());
        }, 0);
    },

    /**
     * Destroys the binding. This does not remove the HTMLElement associated with the binding. This should be done by
     * the view managing the binding.
     */
    destroy: function () {
        var me = this;

        me.removeAllListeners();
        me.removeAllManagedListeners();
    },

    /**
     * @private
     * @param {Ramen.view.Box} view
     */
    onOwnerRenderBefore: function (view) {
        var me = this;

        view.renderData[me.token] = me.getHtml();
    },

    /**
     * @private
     */
    onOwnerRenderDuring: function () {
        var me = this;

        //todo: detach from jquery
        me.el = me.owner.el.find('#' + me.getId());

        me.initChildSelectors();
        me.initChildEls();

        me.update();
    }
});
