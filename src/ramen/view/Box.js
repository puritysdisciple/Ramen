/**
 * @class Ramen.view.Box
 * The base for all views. In general, a box is a managed HTMLElement. For the most part, this class shouldn't need to
 * be used. Instead look at its subclasses as a better starting point for creating views:
 *
 *  - {@link Ramen.view.View}
 *  - {@link Ramen.view.binding.BindingView}
 *  - {@link Ramen.view.container.Container}
 *  - {@link Ramen.view.container.CollectionContainer}
 *
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

    /**
     * @property {String} stype
     * An arbitrary used for locating the view via a {@link Ramen.view.Query}.
     */
    stype: 'box',

    isBox: true,
    /**
     * @cfg
     * Determines whether or not the view should be placed into {@link Ramen.view.ViewManager}
     */
    isManaged: true,
    /**
     * @cfg
     * If set to `true` the view will be rendered on creation. This is used in cojunction with {@link #renderTo}
     */
    autoRender: false,
    /**
     * @cfg {String/Object}
     * The config object used by {@link Ramen.dom.Helper} to create the HTMLElement the box manages.
     */
    tag: null,
    /**
     * @cfg {String} renderTo
     * A css selector that points to where the box should be rendered to if no container is specified.
     */

    config: {
        required: [
            /**
             * @cfg {String} baseId
             * The ID prefix that will be used when creating the auto ID.
             */
            'baseId',
            /**
             * @cfg {String} baseCls
             * The base css class that will be applied to the managed HTMLElement
             */
            'baseCls'
        ]
    },

    /**
     * Creates a new box.
     * @param {Object} config The config object
     */
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
    /**
     * @method
     * Called after mixins have been setup, but before anything else.
     * @template
     */
    initView: JSoop.emptyFn,
    /**
     * Gets the ID of the box. If one is not set, it will be created using the {@link #baseId}.
     * @returns {String}
     */
    getId: function () {
        var me = this;

        if (!me.id) {
            me.id = Ramen.id(me.baseId);
        }

        return me.id;
    },
    /**
     * Renders the box and places it in the specified container.
     * @param {HTMLElement} container The container element to place the box into
     * @param {Number} [index]
     * The index to insert the box at, if this is ommited the box will be appended to the container
     */
    render: function (container, index) {
        var me = this;

        if (me.fireEvent('render:before', me, container, index) === false) {
            return;
        }

        me.fireEvent('render:during', me);

        me.addToContainer(container, index);

        me.isRendered = true;

        if (me.owner && !me.owner.isRendered) {
            me.mon(me.owner, 'render:after', function () {
                me.fireEvent('render:after', me);
            }, me, {
                single: true
            });
        } else {
            me.fireEvent('render:after', me);
        }
    },
    /**
     * @private
     * @param {HTMLElement} container
     * @param {Number} index
     */
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
    /**
     * Adds a css class to the box.
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
     * Removes a css class from the box.
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
    /**
     * Destroys the box. This will remove the box from the dom and do any needed cleanup.
     */
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

    /**
     * @event destroyBefore
     * Fired before the box is destroyed.
     * @param {Ramen.view.Box} me The box that fired the event
     * @preventable
     */
    onDestroyBefore: JSoop.emptyFn,
    /**
     * @event destroy
     * Fired when the box is destroyed.
     * @param {Ramen.view.Box} me The box that fired the event
     */
    onDestroy: JSoop.emptyFn,
    /**
     * @event renderDuring
     * Fired at the beginning of the render process.
     * @param {Ramen.view.Box} me The box that fired the event
     */
    onRenderDuring: JSoop.emptyFn,
    /**
     * @event renderBefore
     * Fired before the render happens
     * @param {Ramen.view.Box} me The box that fired the event
     * @param {HTMLElement} container The container the box was tried to render to
     * @param {Number} index The index the box was tried to render to
     * @preventable
     */
    onRenderBefore: JSoop.emptyFn,
    /**
     * @event renderAfter
     * @param {Ramen.view.Box} me The box that fired the event
     */
    onRenderAfter: JSoop.emptyFn
});
